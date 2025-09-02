import { Prisma } from '@/generated/prisma';
import { prisma } from '@/shared/api/database/prisma';
import type {
  CommentOrderByWithRelationInput,
  CommentWithRelations,
  SimpleCommentCreateInput,
  SimpleCommentUpdateInput,
} from '../model/types';

// Используем типы из Prisma для работы с базой данных
type Comment = Prisma.CommentGetPayload<Record<string, never>>;
type CommentCreateInput = Prisma.CommentCreateInput;
type CommentUpdateInput = Prisma.CommentUpdateInput;
type CommentWhereInput = Prisma.CommentWhereInput;

const defaultIncludes = {
  author: true,
  poem: true,
};

const defaultOrderBy = { createdAt: 'desc' as const };

export const commentRepository = {
  findById: async (id: string): Promise<CommentWithRelations | null> => {
    return prisma.comment.findUnique({
      where: { id },
      include: defaultIncludes,
    }) as Promise<CommentWithRelations | null>;
  },

  findMany: async (
    where: CommentWhereInput,
    params?: {
      skip?: number;
      take?: number;
      orderBy?: CommentOrderByWithRelationInput;
    }
  ): Promise<CommentWithRelations[]> => {
    const { skip, take, orderBy } = params || {};

    return prisma.comment.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || defaultOrderBy,
      include: defaultIncludes,
    }) as Promise<CommentWithRelations[]>;
  },

  findByPoemId: async (
    poemId: string,
    params?: {
      skip?: number;
      take?: number;
      orderBy?: CommentOrderByWithRelationInput;
      where?: Omit<CommentWhereInput, 'poemId'>;
    }
  ): Promise<CommentWithRelations[]> => {
    const { skip, take, orderBy, where } = params || {};
    return commentRepository.findMany({ poemId, ...where }, { skip, take, orderBy });
  },

  findByAuthorId: async (
    authorId: string,
    params?: {
      skip?: number;
      take?: number;
      orderBy?: CommentOrderByWithRelationInput;
      where?: Omit<CommentWhereInput, 'authorId'>;
    }
  ): Promise<CommentWithRelations[]> => {
    const { skip, take, orderBy, where } = params || {};
    return commentRepository.findMany({ authorId, ...where }, { skip, take, orderBy });
  },

  create: async (data: SimpleCommentCreateInput | CommentCreateInput): Promise<Comment> => {
    return prisma.comment.create({
      data: data as CommentCreateInput,
    });
  },

  update: async (
    id: string,
    data: SimpleCommentUpdateInput | CommentUpdateInput
  ): Promise<Comment> => {
    return prisma.comment.update({
      where: { id },
      data: data as CommentUpdateInput,
    });
  },

  delete: async (id: string): Promise<Comment> => {
    return prisma.comment.delete({
      where: { id },
    });
  },

  count: async (where?: CommentWhereInput): Promise<number> => {
    return prisma.comment.count({
      where,
    });
  },
};
