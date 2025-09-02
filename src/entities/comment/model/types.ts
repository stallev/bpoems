// Базовые типы для репозитория
export type Comment = {
  id: string;
  content: string;
  poemId: string;
  authorId: string;
  status: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentCreateInput = {
  content: string;
  poemId: string;
  authorId: string;
  status?: string;
  isApproved?: boolean;
};

export type CommentUpdateInput = {
  content?: string;
  status?: string;
  isApproved?: boolean;
};

export type CommentOrderByWithRelationInput = {
  [key: string]: 'asc' | 'desc';
};

export type CommentWhereInput = {
  id?: string;
  poemId?: string;
  authorId?: string;
  status?: string;
  isApproved?: boolean;
  [key: string]: string | boolean | undefined;
};

export type CommentWithRelations = Comment & {
  poem: {
    id: string;
    title: string;
    slug: string;
  };
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type SimpleCommentCreateInput = {
  content: string;
  poemId: string;
  authorId?: string;
};

export type SimpleCommentUpdateInput = {
  content: string;
};

// Типы для UI компонентов
export interface CommentSectionProps {
  poemId: string;
  comments: Array<{
    id: string;
    content: string;
    poemId: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  }>;
  currentUserId?: string;
}

export interface CommentItemProps {
  comment: CommentSectionProps['comments'][0];
  currentUserId?: string;
  onEditComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onEditSuccess?: () => void;
  onEditCancel?: () => void;
  isEditing: boolean;
  editingCommentId: string | null;
}

export interface CommentsListProps {
  comments: CommentSectionProps['comments'];
  currentUserId?: string;
  onEditComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onEditSuccess?: () => void;
  onEditCancel?: () => void;
  isEditing: boolean;
  editingCommentId: string | null;
}
