import React, { FC, useEffect, useContext } from 'react';
import { useLocation } from 'umi';
import TagNavContext, { TagNavItemData } from './Context';

export interface TagNavItemProps extends Omit<TagNavItemData, 'path'> {}

export const useTagNavItem = (props: TagNavItemProps) => {
  const { pathname } = useLocation();
  const { tagUtil } = useContext(TagNavContext);
  useEffect(() => {
    if (tagUtil) {
      const tag = { ...props, path: pathname };
      tagUtil.addTag(tag);
    }
  }, []);
};

const TagNavItem: FC<TagNavItemProps> = (props) => {
  useTagNavItem(props);
  return <>{props.children}</>;
};

export const withTagNavItem = (tagNavItemProps: TagNavItemProps) => {
  return function RenderTagNavItem<P extends object>(Component: React.ComponentType<P>) {
    return function TagNavItemComponent(props: P) {
      useTagNavItem(tagNavItemProps);
      return <Component {...props} />;
    };
  };
};

export default TagNavItem;
