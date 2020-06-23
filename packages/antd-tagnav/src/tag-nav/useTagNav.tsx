import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'umi';
import { TagNavItemData, TagNavContextType } from './Context';

export type pathFilterFunc = (path: string) => boolean;

export const ignorePathFilters: pathFilterFunc[] = [
  (path) => path === '/',
  (path) => path === '/404',
  (path) => path.startsWith('/exception'),
];

const needIgnore = (path: string) => {
  for (let index = 0; index < ignorePathFilters.length; index += 1) {
    const func = ignorePathFilters[index];
    if (func(path)) {
      return true;
    }
  }
  return false;
};

/**
 * TagNavContext 的默认实现
 * @param props
 */
const useTagNav = (props?: {
  defaultTags?: TagNavItemData[];
  defaultActiveTag?: TagNavItemData;
}) => {
  const [tags, setTags] = useState<TagNavItemData[]>(props?.defaultTags || []);
  const [active, setActive] = useState<TagNavItemData['path'] | undefined>(
    props?.defaultActiveTag?.path,
  );

  const hasTags = () => tags.length > 0;
  const hasActive = () => !!active;
  const existTagPath = (tagPath: TagNavItemData['path']) => tags.some((t) => t.path === tagPath);
  const canRemove = (tagPath: TagNavItemData['path']) =>
    tags.some((t) => t.path === tagPath && !t.pin && t.closable);
  const isActived = (path: TagNavItemData['path']) => active === path;

  const history = useHistory();

  const changeTags = (readyAddTags: TagNavItemData[]) => {
    const newTags: TagNavItemData[] = [];

    const srcTags = readyAddTags
      .filter((t) => !needIgnore(t.path))
      .reduce(
        (data, current) => {
          if (current.pin) {
            data.pinTags.push(current);
          } else if (!current.closable) {
            data.cannotCloseTags.push(current);
          } else {
            data.otherTags.push(current);
          }
          return data;
        },
        {
          pinTags: [],
          cannotCloseTags: [],
          otherTags: [],
        } as {
          pinTags: TagNavItemData[];
          cannotCloseTags: TagNavItemData[];
          otherTags: TagNavItemData[];
        },
      );

    const tmp = [...srcTags.pinTags, ...srcTags.cannotCloseTags, ...srcTags.otherTags];
    tmp.forEach((item) => {
      if (!newTags.some((t) => t.path === item.path)) {
        newTags.push(item);
      }
    });

    setTags(newTags);
  };

  const callActiveEvent = (activeTagPath: TagNavItemData['path']) => {
    tags
      .filter((tag) => tag.path !== activeTagPath)
      .forEach((tag) => {
        try {
          if (tag.onHide) {
            setTimeout(() => {
              if (tag.onHide) {
                tag.onHide();
              }
            }, 0);
          }
        } catch (error) {
          console.error(`onHide TagNav ${tag.path} error:\n`, error);
        }
      });

    const activeTag = tags.find((t) => t.path === activeTagPath);
    if (activeTag) {
      try {
        if (activeTag.onShow) {
          setTimeout(() => {
            if (activeTag.onShow) {
              activeTag.onShow();
            }
          }, 0);
        }
      } catch (error) {
        console.error(`onShow TagNav ${activeTag.path} error:\n`, error);
      }
    }
  };

  const changeActive = (activeTagPath: TagNavItemData['path'], disableRedirect?: boolean) => {
    if (hasActive() && isActived(activeTagPath) && !existTagPath(activeTagPath)) return;

    setActive(activeTagPath);

    callActiveEvent(activeTagPath);

    if (!disableRedirect) {
      history.replace(activeTagPath);
    }
  };

  const addTag = (tag: TagNavItemData) => {
    const newTag = {
      ...tag,
      closable: tag.closable === undefined ? true : tag.closable,
    };
    if (!existTagPath(tag.path)) {
      changeTags([...tags, newTag]);
    }
    changeActive(newTag.path, true);
  };

  const removeTag = (tagPath: TagNavItemData['path']) => {
    if (!canRemove(tagPath)) return;

    const newTags = tags.filter((c) => c.path !== tagPath);

    const removeCurrent = () => {
      const activeIndex = tags.findIndex((t) => t.path === tagPath);
      let newActiveIndex = activeIndex - 1;
      if (newActiveIndex < 0 && newTags.length > 0) {
        newActiveIndex = 0;
      }
      changeTags(newTags);
      if (newActiveIndex >= 0) {
        const newActive = newTags[newActiveIndex].path;
        changeActive(newActive);
      } else {
        // 如果newTags没有数据了，但设置了默认的path，那么我们需要通过重定向来重载path对应的Tag
        history.replace(props?.defaultActiveTag?.path || '/');
      }
    };

    const removeOther = () => {
      changeTags(newTags);
    };

    const removedTag = tags.find((t) => t.path === tagPath);
    if (removedTag) {
      if (removedTag.beforeClose) {
        try {
          removedTag.beforeClose(removedTag);
        } catch (error) {
          console.error(`beforeClose TagNav ${removedTag.path} error:\n`, error);
        }
      }

      if (active === tagPath) {
        removeCurrent();
      } else {
        removeOther();
      }

      if (removedTag.afterClose) {
        try {
          removedTag.afterClose(removedTag);
        } catch (error) {
          console.error(`afterClose TagNav ${removedTag.path} error:\n`, error);
        }
      }
    }
  };

  const { pathname } = useLocation();

  useEffect(() => {
    if (!hasActive() && hasTags()) {
      if (!existTagPath(pathname) && !needIgnore(pathname)) {
        /**
         * 处理浏览器刷新后，确保当前访问的Tag保持激活状态
         * Note:
         *  当使用F5刷新浏览器后，JS文件被重新下载，所有组件都被重载，导致tags状态数据回到初始值，
         *  通过API history.replace重定向后，会将path对应的组件重新添加到tags数组中，
         *  然后激活Tag，并触发onShow事件；
         *  （此方法仅能保证默认的Tag和当前激活的Tag会被加载）
         */
        history.replace(pathname);
      } else {
        // 如果没有激活的tag，但是tags里有数据，那么我们可以激活第1个
        changeActive(tags[0].path);
      }
    }
  }, [tags]);

  return {
    tags,
    active,
    tagUtil: {
      addTag,
      removeTag,
      changeActive,
    },
  } as TagNavContextType;
};

export default useTagNav;
