// Import types from generated Prisma Client
import { ShortCategoryFromDB } from '@/entities/category/model/types';
import { CommentPoemDataFromDB, CommentRenderDataType } from '@/entities/comment/model/types';
import { ReviewFromDB, ReviewRenderDataType } from '@/entities/review/model/types';
import type { StatisticsFromDB } from '@/entities/statistics/model/types';
import type { ShortUserDataFromDB } from '@/entities/user/model/types';
import type { Poem as PrismaPoem, Prisma, Tag, Statistics } from '@/generated/prisma';
import { RichTextContentType } from '@/shared/model/SimpleTypes';

// Re-export base types from Prisma
export type Poem = PrismaPoem;
export type PoemCreateInput = Prisma.PoemCreateInput;
export type PoemUpdateInput = Prisma.PoemUpdateInput;
export type PoemWhereInput = Prisma.PoemWhereInput;
export type PoemOrderByWithRelationInput = Prisma.PoemOrderByWithRelationInput;

// Extended type for poem with included relations
export interface PoemWithRelations extends PrismaPoem {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  category: {
    id: string;
    translatedItems: Array<{
      id: string;
      type: string;
      values: Record<string, string>;
    }>;
  } | null;
  tags: Tag[]; // Changed: array of Tag objects instead of { tag: { id, name } }
  comments?: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      name: string | null;
    };
  }[];
  reviews?: {
    id: string;
    title: string | null;
    content: string;
    createdAt: Date;
    rating: number;
    userId: string;
    poemId: string;
    user: {
      id: string;
      name: string | null;
    };
  }[];
  statistics?: Statistics | null;
}

// Simplified types for more convenient use in the application
export type SimplePoemCreateInput = Omit<
  Prisma.PoemUncheckedCreateInput,
  'category' | 'tags' | 'statistics'
> & {
  category?: {
    connect?: { id: string };
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
  };
  statistics?: {
    create?: { views: number; edits: number; likes: number; shares: number };
  };
};

export type SimplePoemUpdateInput = Omit<
  Prisma.PoemUncheckedUpdateInput,
  'category' | 'tags' | 'statistics'
> & {
  category?: {
    connect?: { id: string };
    disconnect?: boolean;
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
    disconnect?: { tagId: string }[];
  };
  statistics?: {
    update?: { views?: number; edits?: number; likes?: number; shares?: number };
  };
};

export interface PoemFrom {
  poem: PoemWithRelations;
  author: ShortUserDataFromDB;
  currentUserId?: string;
}

export interface PoemWithReviewsAndCommentsFromDB {
  id: string;
  slug: string;
  title: string | null;
  content: RichTextContentType;
  description: string | null;
  authorId: string;
  status: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author: ShortUserDataFromDB;
  reviews: ReviewFromDB[] | [];
  category: ShortCategoryFromDB | null;
  tags: Tag[];
  statistics: StatisticsFromDB | null;
  comments: CommentPoemDataFromDB[] | [];
}

export interface PoemRenderDataType {
  id: string;
  slug: string;
  title: string;
  content: RichTextContentType;
  description: string | null;
  authorId: string;
  status: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  author: ShortUserDataFromDB;
  reviews: ReviewRenderDataType[] | [];
  category: ShortCategoryFromDB;
  tags: Tag[];
  statistics: StatisticsFromDB;
  comments: CommentRenderDataType[] | [];
}

export interface ShortPoemData {
  id: string;
  slug: string;
  title: string;
}
