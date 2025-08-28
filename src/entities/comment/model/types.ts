// Import types from generated Prisma Client
import type { Comment as PrismaComment, Prisma } from '@/generated/prisma';

// Re-export base types from Prisma
export type Comment = PrismaComment;
export type CommentCreateInput = Prisma.CommentCreateInput;
export type CommentUpdateInput = Prisma.CommentUpdateInput;
export type CommentWhereInput = Prisma.CommentWhereInput;
export type CommentOrderByWithRelationInput = Prisma.CommentOrderByWithRelationInput;

// Extended type for comment with included relations
export interface CommentWithRelations extends PrismaComment {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  poem: {
    id: string;
    title: string;
    slug: string;
  };
}

// Simplified types for more convenient use in the application
export type SimpleCommentCreateInput = Omit<
  Prisma.CommentUncheckedCreateInput,
  'author' | 'poem'
> & {
  authorId: string;
  poemId: string;
};

export type SimpleCommentUpdateInput = Omit<
  Prisma.CommentUncheckedUpdateInput,
  'author' | 'poem'
> & {
  authorId?: string;
  poemId?: string;
};
