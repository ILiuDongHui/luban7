import React, { FC, useContext } from 'react';
import Tag from 'antd/es/tag';
import classnames from 'classnames';
import TagNavContext, { TagNavItemData } from './Context';
import styles from './index.less';

export interface TagNavProps {
  prefixCls?: string;
  renderTags?: (tags: TagNavItemData[], defaultDom: React.ReactNode) => React.ReactNode;
  renderTagsAddonBefore?: () => React.ReactNode;
  renderTagsAddonAfter?: () => React.ReactNode;
  renderTagItem?: (tag: TagNavItemData, defaultDom: React.ReactNode) => React.ReactNode;
  renderTagItemTitle?: (tag: TagNavItemData) => React.ReactNode;
}

const TagNav: FC<TagNavProps> = (props) => {
  const {
    prefixCls = 'tag-nav',
    renderTags,
    renderTagsAddonBefore,
    renderTagsAddonAfter,
    renderTagItem,
    renderTagItemTitle,
  } = props;

  const { tags = [], active, tagUtil } = useContext(TagNavContext);

  if (!tagUtil) return null;

  const { removeTag, changeActive } = tagUtil;

  const isActived = (path: TagNavItemData['path']) => active === path;

  const renderDefaultTagItem = (tag: TagNavItemData) => {
    const titleDom = renderTagItemTitle ? renderTagItemTitle(tag) : tag.title;

    const tagItemClassName = classnames(
      styles[`${prefixCls}-item`],
      isActived(tag.path) ? styles[`${prefixCls}-item-active`] : undefined,
    );

    const tagItemDom = (
      <div key={tag.path} className={tagItemClassName}>
        <Tag
          key={tag.path}
          closable={tag.closable === undefined ? true : tag.closable}
          onClick={(e) => {
            e.preventDefault();
            if (isActived(tag.path)) return;
            changeActive(tag.path);
          }}
          onClose={() => removeTag(tag.path)}
        >
          {titleDom}
        </Tag>
      </div>
    );
    return tagItemDom;
  };

  const renderDefaultTagsDom = () => {
    const tagsDom = tags.map((tag) => {
      const tagItemDom = renderDefaultTagItem(tag);
      if (renderTagItem) {
        return renderTagItem(tag, tagItemDom);
      }
      return tagItemDom;
    });
    return (
      <div className={styles[prefixCls]}>
        {renderTagsAddonBefore && renderTagsAddonBefore()}
        <div className={styles[`${prefixCls}-content`]}>{tagsDom}</div>
        {renderTagsAddonAfter && renderTagsAddonAfter()}
      </div>
    );
  };

  const renderTagsDom = () => {
    const tagsDom = renderDefaultTagsDom();
    if (renderTags) {
      return renderTags(tags, tagsDom);
    }
    return tagsDom;
  };

  return <>{renderTagsDom()}</>;
};

export default TagNav;
