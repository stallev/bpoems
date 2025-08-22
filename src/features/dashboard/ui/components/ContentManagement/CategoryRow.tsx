'use client';

import { Edit, Trash2, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { CategoryWithTranslation } from '@/entities/category/model/types';
import { Badge } from '@/shared/ui/shadcnComponents/badge';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcnComponents/dropdown-menu';
import { CategoryEditForm } from './CategoryEditForm';

interface CategoryRowProps {
  category: CategoryWithTranslation;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  canDelete: boolean;
}

export function CategoryRow({ category, onDelete, onToggleStatus, canDelete }: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      onDelete(category.id);
    }
  };

  const handleToggleStatus = () => {
    onToggleStatus(category.id, !category.isActive);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b hover:bg-muted/50 transition-colors">
        <div className="flex items-center space-x-4 flex-1">
          {/* Порядок */}
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {category.order}
          </div>

          {/* Названия на разных языках */}
          <div className="flex-1">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{category.name.EN}</span>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-x-4">
                <span>RU: {category.name.RU}</span>
                <span>UA: {category.name.UA}</span>
              </div>
            </div>
          </div>

          {/* Количество стихов */}
          <div className="text-sm text-muted-foreground">{category.poemCount || 0} стихов</div>

          {/* Дата создания */}
          <div className="text-sm text-muted-foreground">
            {new Date(category.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleToggleStatus} className="h-8 w-8 p-0">
            {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus}>
                {category.isActive ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Деактивировать
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Активировать
                  </>
                )}
              </DropdownMenuItem>
              {canDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Форма редактирования */}
      {isEditing && (
        <div className="bg-muted/30 p-4 border-b">
          <CategoryEditForm
            category={category}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      )}
    </>
  );
}
