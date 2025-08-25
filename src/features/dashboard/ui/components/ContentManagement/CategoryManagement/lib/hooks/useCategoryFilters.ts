'use client';

import { useState, useMemo } from 'react';
import { CategoryWithTranslation } from '@/entities/category';
import { FilterType } from '../../model';

export const useCategoryFilters = (categories: CategoryWithTranslation[]) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return {
    activeFilter,
    filteredCategories,
    handleFilterChange,
  };
};
