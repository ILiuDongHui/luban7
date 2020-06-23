import React from 'react';
import TagNavContext, { TagNavItemData } from './Context';
import useTagNav from './useTagNav';

const TagNavProvider: React.FC<{
  defaultTags?: TagNavItemData[];
  defaultActiveTag?: TagNavItemData;
}> = (props) => {
  const { children, defaultTags, defaultActiveTag } = props;
  const { tags, active, tagUtil } = useTagNav({ defaultTags, defaultActiveTag });
  return (
    <TagNavContext.Provider value={{ tags, active, tagUtil }}>{children}</TagNavContext.Provider>
  );
};

export default TagNavProvider;
