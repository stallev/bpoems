import type { CategoryWithTranslation, CategoryStats } from '@/entities/category/model/types';

export type FilterType = 'all' | 'active' | 'inactive';

export interface CategoryManagementProps {
  categories: CategoryWithTranslation[];
  stats: CategoryStats;
  isLoading: boolean;
  canDelete: boolean;
}

export interface CategoryRowProps {
  category: CategoryWithTranslation;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  canDelete: boolean;
}

export interface CategoryStatsProps {
  stats: CategoryStats;
  isLoading: boolean;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface CategoryActionState {
  success: boolean;
  message: string;
  data?: { id: string };
}

export interface CategoryFormData {
  translations: {
    EN: string;
    RU: string;
    UA: string;
  };
  isActive: boolean;
  order?: number;
}
