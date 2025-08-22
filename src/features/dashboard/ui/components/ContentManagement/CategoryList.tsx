'use client';

import { useTransition, useState, useMemo } from 'react';
import { toast } from 'sonner';
import type {
  CategoryWithTranslation,
  CategoryStats as CategoryStatsType,
} from '@/entities/category/model/types';
import {
  deleteCategory,
  toggleCategoryStatus,
} from '@/features/dashboard/server-actions/categories';
import { CategoryCreateForm } from './CategoryCreateForm';
import { CategoryRow } from './CategoryRow';
import { CategoryStats } from './CategoryStats';

interface CategoryListProps {
  categories: CategoryWithTranslation[];
  stats: CategoryStatsType;
  isLoading: boolean;
  canDelete: boolean;
}

type FilterType = 'all' | 'active' | 'inactive';

export function CategoryList({ categories, stats, isLoading, canDelete }: CategoryListProps) {
  const [, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter categories
  const filteredCategories = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return categories.filter(category => category.isActive);
      case 'inactive':
        return categories.filter(category => !category.isActive);
      default:
        return categories;
    }
  }, [categories, activeFilter]);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    startTransition(async () => {
      const result = await toggleCategoryStatus(id, isActive);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CategoryStats stats={stats} isLoading={true} />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика с фильтрами */}
      <CategoryStats
        stats={stats}
        isLoading={false}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Форма создания */}
      <CategoryCreateForm />

      {/* Список категорий */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Категории ({filteredCategories.length})
              {activeFilter !== 'all' && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  • {activeFilter === 'active' ? 'Активные' : 'Неактивные'}
                </span>
              )}
            </h3>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Показать все
              </button>
            )}
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {activeFilter === 'all' ? (
              <p>Категории не найдены</p>
            ) : activeFilter === 'active' ? (
              <p>Активные категории не найдены</p>
            ) : (
              <p>Неактивные категории не найдены</p>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredCategories.map(category => (
              <CategoryRow
                key={category.id}
                category={category}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                canDelete={canDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
