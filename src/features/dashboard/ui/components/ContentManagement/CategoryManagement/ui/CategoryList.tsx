'use client';

import { CategoryRow } from './CategoryRow';
import { CategoryStats } from './CategoryStats';
import { CategoryCreateForm } from '../../CategoryForms/ui/CategoryCreateForm';
import { useCategoryActions, useCategoryFilters } from '../lib/hooks';
import type { CategoryManagementProps } from '../model/types';

export const CategoryList = ({
  categories,
  stats,
  isLoading,
  canDelete,
}: CategoryManagementProps) => {
  const { handleDelete, handleToggleStatus } = useCategoryActions();
  const { activeFilter, filteredCategories, handleFilterChange } = useCategoryFilters(categories);

  const handleEdit = (id: string) => {
    // Логика редактирования обрабатывается в CategoryRow
    console.log('Edit category:', id);
  };

  return (
    <div className="space-y-6">
      {/* Статистика с фильтрами */}
      <CategoryStats
        stats={stats}
        isLoading={isLoading}
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
                onClick={() => handleFilterChange('all')}
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
                onEdit={handleEdit}
                canDelete={canDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
