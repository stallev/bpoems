'use client';

import { BarChart3, Folder, FileText, Users, Eye, EyeOff } from 'lucide-react';
import type { CategoryStats as CategoryStatsType } from '@/entities/category/model/types';
import type { CategoryStatsProps } from '../model/types';
import { Badge } from '@/shared/ui/shadcnComponents/badge';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcnComponents/card';
import { calculateInactiveCategories, calculateActivePercentage } from '../lib/utils';

export const CategoryStats = ({
  stats,
  isLoading,
  activeFilter,
  onFilterChange,
}: CategoryStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isActiveFilter = activeFilter === 'active';
  const isInactiveFilter = activeFilter === 'inactive';
  const isAllFilter = activeFilter === 'all';
  const inactiveCategories = calculateInactiveCategories(
    stats.totalCategories,
    stats.activeCategories
  );
  const activePercentage = calculateActivePercentage(stats.totalCategories, stats.activeCategories);

  return (
    <div className="space-y-4">
      {/* Фильтр состояния */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Показать:</span>
        <div className="flex items-center gap-1">
          <Button
            variant={isAllFilter ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange?.('all')}
            className="h-8 cursor-pointer hover:shadow-md"
          >
            Все ({stats.totalCategories})
          </Button>
          <Button
            variant={isActiveFilter ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange?.('active')}
            className="h-8 cursor-pointer hover:shadow-md"
          >
            <Eye className="h-3 w-3 mr-1" />
            Активные ({stats.activeCategories})
          </Button>
          <Button
            variant={isInactiveFilter ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange?.('inactive')}
            className="h-8 cursor-pointer hover:shadow-md"
          >
            <EyeOff className="h-3 w-3 mr-1" />
            Неактивные ({inactiveCategories})
          </Button>
        </div>
      </div>

      {/* Карточки статистики */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Общее количество категорий */}
        <Card
          className={`transition-all duration-200 ${
            isAllFilter ? 'ring-2 ring-primary/20 shadow-md' : ''
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего категорий</CardTitle>
            <div className="flex items-center gap-1">
              <Folder className="h-4 w-4 text-muted-foreground" />
              {isAllFilter && (
                <Badge variant="secondary" className="text-xs">
                  Активно
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Всего категорий в системе</p>
          </CardContent>
        </Card>

        {/* Активные категории */}
        <Card
          className={`transition-all duration-200 ${
            isActiveFilter ? 'ring-2 ring-green-500/20 shadow-md' : ''
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные категории</CardTitle>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-green-600" />
              {isActiveFilter && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  Активно
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCategories}</div>
            <p className="text-xs text-muted-foreground">Доступны для использования</p>
          </CardContent>
        </Card>

        {/* Неактивные категории */}
        <Card
          className={`transition-all duration-200 ${
            isInactiveFilter ? 'ring-2 ring-orange-500/20 shadow-md' : ''
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Неактивные категории</CardTitle>
            <div className="flex items-center gap-1">
              <EyeOff className="h-4 w-4 text-orange-600" />
              {isInactiveFilter && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                  Активно
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inactiveCategories}</div>
            <p className="text-xs text-muted-foreground">Скрыты от пользователей</p>
          </CardContent>
        </Card>

        {/* Категории со стихами */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Категории со стихами</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesWithPoems}</div>
            <p className="text-xs text-muted-foreground">Содержат стихи</p>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительная статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Среднее количество стихов */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Среднее стихов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePoemsPerCategory.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">На категорию</p>
          </CardContent>
        </Card>

        {/* Процент активных категорий */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активность</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePercentage}%</div>
            <p className="text-xs text-muted-foreground">Категорий активно</p>
          </CardContent>
        </Card>

        {/* Пустая карточка для баланса */}
        <Card className="opacity-0 pointer-events-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">&nbsp;</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&nbsp;</div>
            <p className="text-xs text-muted-foreground">&nbsp;</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
