import React, { createContext } from 'react';

export interface TagNavItemData {
  path: string;
  title: React.ReactNode;
  closable?: boolean;
  pin?: boolean;
  dragable?: boolean;
  onHide?: () => void;
  onShow?: () => void;
  beforeClose?: (tag: TagNavItemData) => void;
  afterClose?: (tag: TagNavItemData) => void;
}

export interface TagNavContextType {
  readonly tagUtil?: {
    addTag: (tag: TagNavItemData) => void;
    removeTag: (tagPath: TagNavItemData['path']) => void;
    changeActive: (activeTag: TagNavItemData['path']) => void;
  };
  readonly tags?: TagNavItemData[];
  readonly active?: TagNavItemData['path'];
}

const TagNavContext: React.Context<TagNavContextType> = createContext({});

export default TagNavContext;
