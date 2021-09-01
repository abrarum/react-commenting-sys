/// <reference types="react-scripts" />
type T_Comment = {
    id: string;
    content: string;
    replies: T_Comment[];
  };