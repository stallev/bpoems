// Import types from generated Prisma Client
import type { Poem as PrismaPoem, Prisma, Tag } from '@/generated/prisma';

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
    name: Record<string, string>;
  } | null;
  tags: Tag[]; // Changed: array of Tag objects instead of { tag: { id, name } }
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
export type SimplePoemCreateInput = Omit<Prisma.PoemUncheckedCreateInput, 'category' | 'tags'> & {
  category?: {
    connect?: { id: string };
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
  };
};

export type SimplePoemUpdateInput = Omit<Prisma.PoemUncheckedUpdateInput, 'category' | 'tags'> & {
  category?: {
    connect?: { id: string };
    disconnect?: boolean;
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
    disconnect?: { tagId: string }[];
  };
};
