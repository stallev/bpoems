import { prisma } from '@/shared/api/database/prisma';
import type {
  Category,
  CategoryUpdateInput,
  CategoryOrderByWithRelationInput,
  CategoryWhereInput,
  CategoryWithRelations,
  CategoryWithTranslation,
  CreateCategoryData,
  UpdateCategoryData,
  TranslationValues,
} from '../model/types';

export const categoryRepository = {
  // Find category by ID with relations
  findById: async (id: string): Promise<CategoryWithRelations | null> => {
    return prisma.category.findUnique({
      where: { id },
      include: {
        translatedName: true,
        poems: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        _count: {
          select: {
            poems: true,
          },
        },
      },
    }) as Promise<CategoryWithRelations | null>;
  },

  // Find all categories with optional filtering and pagination
  findAll: async (params?: {
    skip?: number;
    take?: number;
    orderBy?: CategoryOrderByWithRelationInput;
    where?: CategoryWhereInput;
    includePoems?: boolean;
  }): Promise<CategoryWithRelations[]> => {
    const { skip, take, orderBy, where, includePoems = false } = params || {};

    return prisma.category.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        translatedName: true,
        ...(includePoems && {
          poems: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        }),
        _count: {
          select: {
            poems: true,
          },
        },
      },
    }) as Promise<CategoryWithRelations[]>;
  },

  // Find active categories ordered by order field
  findActive: async (params?: {
    skip?: number;
    take?: number;
  }): Promise<CategoryWithRelations[]> => {
    const { skip, take } = params || {};

    return prisma.category.findMany({
      where: { isActive: true },
      skip,
      take,
      orderBy: { order: 'asc' },
      include: {
        translatedName: true,
        _count: {
          select: {
            poems: true,
          },
        },
      },
    }) as Promise<CategoryWithRelations[]>;
  },

  // Create category with translations
  create: async (data: CreateCategoryData): Promise<Category> => {
    const { translations, ...categoryData } = data;

    return prisma.category.create({
      data: {
        ...categoryData,
        translatedName: {
          create: {
            type: 'POEM_CATEGORY',
            values: translations as any,
          },
        },
      },
    });
  },

  // Update category with optional translation updates
  update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    const { translations, ...categoryData } = data;

    const updateData: CategoryUpdateInput = {
      ...categoryData,
    };

    // If translations are provided, update them
    if (translations) {
      updateData.translatedName = {
        update: {
          values: translations as any,
        },
      };
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete category (this will also delete the associated TranslatedItem due to cascade)
  delete: async (id: string): Promise<Category> => {
    return prisma.category.delete({
      where: { id },
    });
  },

  // Soft delete - deactivate category
  deactivate: async (id: string): Promise<Category> => {
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  },

  // Activate category
  activate: async (id: string): Promise<Category> => {
    return prisma.category.update({
      where: { id },
      data: { isActive: true },
    });
  },

  // Update category order
  updateOrder: async (id: string, order: number): Promise<Category> => {
    return prisma.category.update({
      where: { id },
      data: { order },
    });
  },

  // Get categories with translation data for dashboard
  findForDashboard: async (params?: {
    skip?: number;
    take?: number;
    includeInactive?: boolean;
  }): Promise<CategoryWithTranslation[]> => {
    const { skip, take, includeInactive = false } = params || {};

    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      skip,
      take,
      orderBy: { order: 'asc' },
      include: {
        translatedName: true,
        _count: {
          select: {
            poems: true,
          },
        },
      },
    });

    return categories.map(category => ({
      id: category.id,
      isActive: category.isActive,
      order: category.order,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      name: category.translatedName.values as unknown as TranslationValues,
      poemCount: category._count?.poems || 0,
    }));
  },

  // Find category by translation name (useful for search)
  findByTranslationName: async (
    name: string,
    locale: keyof TranslationValues = 'EN'
  ): Promise<CategoryWithRelations | null> => {
    return prisma.category.findFirst({
      where: {
        translatedName: {
          values: {
            path: [locale],
            equals: name,
          },
        },
      },
      include: {
        translatedName: true,
        _count: {
          select: {
            poems: true,
          },
        },
      },
    }) as Promise<CategoryWithRelations | null>;
  },

  // Get categories with poem count for statistics
  findWithStats: async (): Promise<Array<CategoryWithRelations & { poemCount: number }>> => {
    const categories = await prisma.category.findMany({
      include: {
        translatedName: true,
        _count: {
          select: {
            poems: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return categories.map(category => ({
      ...category,
      poemCount: category._count?.poems || 0,
    }));
  },

  // Check if category name already exists
  existsByName: async (
    name: string,
    locale: keyof TranslationValues = 'EN',
    excludeId?: string
  ): Promise<boolean> => {
    const where: CategoryWhereInput = {
      translatedName: {
        values: {
          path: [locale],
          equals: name,
        },
      },
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await prisma.category.count({ where });
    return count > 0;
  },

  // Get next order number for new category
  getNextOrder: async (): Promise<number> => {
    const lastCategory = await prisma.category.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return (lastCategory?.order || 0) + 1;
  },
};
