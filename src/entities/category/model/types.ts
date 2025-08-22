// Import types from generated Prisma Client
import type {
  Category as PrismaCategory,
  TranslatedItem as PrismaTranslatedItem,
  Prisma,
} from '@/generated/prisma';

// Re-export base types from Prisma
export type Category = PrismaCategory;
export type TranslatedItem = PrismaTranslatedItem;
export type CategoryCreateInput = Prisma.CategoryCreateInput;
export type CategoryUpdateInput = Prisma.CategoryUpdateInput;
export type CategoryWhereInput = Prisma.CategoryWhereInput;
export type CategoryOrderByWithRelationInput = Prisma.CategoryOrderByWithRelationInput;
export type TranslatedItemCreateInput = Prisma.TranslatedItemCreateInput;
export type TranslatedItemUpdateInput = Prisma.TranslatedItemUpdateInput;

// Type for translation values
export interface TranslationValues {
  EN: string;
  RU: string;
  UA: string;
}

// Extended type for category with included relations
export interface CategoryWithRelations extends PrismaCategory {
  translatedName: TranslatedItem;
  poems?: {
    id: string;
    title: string;
    status: string;
  }[];
  _count?: {
    poems: number;
  };
}

// Simplified types for more convenient use in the application
export type SimpleCategoryCreateInput = {
  isActive?: boolean;
  order?: number;
  translations: TranslationValues;
};

export type SimpleCategoryUpdateInput = {
  isActive?: boolean;
  order?: number;
  translations?: TranslationValues;
};

// Type for category with translation data
export interface CategoryWithTranslation {
  id: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  name: TranslationValues;
  poemCount?: number;
}

// Type for creating category with translations
export interface CreateCategoryData {
  isActive?: boolean;
  order?: number;
  translations: TranslationValues;
}

// Type for updating category with translations
export interface UpdateCategoryData {
  isActive?: boolean;
  order?: number;
  translations?: TranslationValues;
}

// Type for category filters
export interface CategoryFilters {
  isActive?: boolean;
  search?: string;
  orderBy?: 'name' | 'order' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Type for category statistics
export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  categoriesWithPoems: number;
  averagePoemsPerCategory: number;
}
