'use client';

import { X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@/shared/ui/shadcnComponents/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import { Input } from '@/shared/ui/shadcnComponents/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcnComponents/select';
import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
// Local constants to avoid import issues
const POEM_LABELS = {
  TITLE: 'Title',
  TITLE_PLACEHOLDER: 'Enter poem title...',
  SLUG: 'Slug',
  SLUG_PLACEHOLDER: 'poem-title-url',
  DESCRIPTION: 'Description',
  DESCRIPTION_PLACEHOLDER: 'Brief description of your poem...',
  CATEGORY: 'Category',
  CATEGORY_PLACEHOLDER: 'Select a category...',
  TAGS: 'Tags',
  TAGS_PLACEHOLDER: 'Add tags...',
  LANGUAGE: 'Language',
};

const POEM_FORM_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS_COUNT: 10,
  SLUG_PATTERN: /^[a-z0-9-]+$/,
};

// Define types locally to avoid import issues
interface PoemMetadataFieldsProps {
  form: any; // React Hook Form instance
  categories?: Array<{ id: string; name: string }>;
  availableTags?: string[];
}

export const PoemMetadataFields = ({
  form,
  categories = [],
  availableTags = [],
}: PoemMetadataFieldsProps) => {
  const { watch, setValue } = useFormContext();
  const tags = watch('tags') || [];

  const handleTitleChange = (value: string) => {
    setValue('title', value);
    // Auto-generate slug if in create mode
    const mode = (window.location.pathname.includes('edit') ? 'edit' : 'create') as
      | 'create'
      | 'edit';
    if (mode === 'create' && value) {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
      setValue('slug', slug);
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();

      if (value && !tags.includes(value) && tags.length < POEM_FORM_CONSTANTS.MAX_TAGS_COUNT) {
        setValue('tags', [...tags, value]);
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((tag: string) => tag !== tagToRemove)
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{POEM_LABELS.TITLE}</FormLabel>
            <FormControl>
              <Input
                placeholder={POEM_LABELS.TITLE_PLACEHOLDER}
                {...field}
                onChange={e => handleTitleChange(e.target.value)}
                maxLength={POEM_FORM_CONSTANTS.MAX_TITLE_LENGTH}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Slug */}
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{POEM_LABELS.SLUG}</FormLabel>
            <FormControl>
              <Input
                placeholder={POEM_LABELS.SLUG_PLACEHOLDER}
                {...field}
                pattern={POEM_FORM_CONSTANTS.SLUG_PATTERN.source}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{POEM_LABELS.DESCRIPTION}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={POEM_LABELS.DESCRIPTION_PLACEHOLDER}
                {...field}
                maxLength={POEM_FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category */}
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{POEM_LABELS.CATEGORY}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={POEM_LABELS.CATEGORY_PLACEHOLDER} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">No category</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags */}
      <FormField
        control={form.control}
        name="tags"
        render={() => (
          <FormItem>
            <FormLabel>{POEM_LABELS.TAGS}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  placeholder={POEM_LABELS.TAGS_PLACEHOLDER}
                  onKeyDown={handleTagInput}
                  disabled={tags.length >= POEM_FORM_CONSTANTS.MAX_TAGS_COUNT}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {availableTags.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Suggested tags: {availableTags.slice(0, 5).join(', ')}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Language */}
      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{POEM_LABELS.LANGUAGE}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="RU">Русский</SelectItem>
                <SelectItem value="UA">Українська</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
