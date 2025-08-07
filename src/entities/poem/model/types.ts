// Import types from generated Prisma Client
import type { Poem as PrismaPoem, Prisma } from '@/generated/prisma';

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
  };
  categories: {
    category: {
      id: string;
      name: Record<string, string>; // JSON with translations
    };
  }[];
  tags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
  comments?: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string | null;
    };
  }[];
}

// Simplified types for more convenient use in the application
export type SimplePoemCreateInput = Omit<Prisma.PoemUncheckedCreateInput, 'categories' | 'tags'> & {
  categories?: {
    create?: { categoryId: string }[];
    connect?: { categoryId: string }[];
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
  };
};

export type SimplePoemUpdateInput = Omit<Prisma.PoemUncheckedUpdateInput, 'categories' | 'tags'> & {
  categories?: {
    create?: { categoryId: string }[];
    connect?: { categoryId: string }[];
    disconnect?: { categoryId: string }[];
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
    disconnect?: { categoryId: string }[];
  };
};
