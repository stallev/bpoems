'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import { Input } from '@/shared/ui/shadcnComponents/input';
import { Switch } from '@/shared/ui/shadcnComponents/switch';
import { CATEGORY_LABELS } from '../../CategoryManagement/model/constants';
import { categoryFormSchema, type CategoryFormData } from '../model/schemas';

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => void;
  children: React.ReactNode;
}

export const CategoryForm = ({ defaultValues, onSubmit, children }: CategoryFormProps) => {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      translations: {
        EN: '',
        RU: '',
        UA: '',
      },
      isActive: true,
      order: undefined,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="translations.EN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{CATEGORY_LABELS.NAME_EN}</FormLabel>
                <FormControl>
                  <Input placeholder={CATEGORY_LABELS.PLACEHOLDER_EN} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.RU"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{CATEGORY_LABELS.NAME_RU}</FormLabel>
                <FormControl>
                  <Input placeholder={CATEGORY_LABELS.PLACEHOLDER_RU} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translations.UA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{CATEGORY_LABELS.NAME_UA}</FormLabel>
                <FormControl>
                  <Input placeholder={CATEGORY_LABELS.PLACEHOLDER_UA} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{CATEGORY_LABELS.ORDER}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={CATEGORY_LABELS.PLACEHOLDER_ORDER}
                    min="0"
                    max="1000"
                    {...field}
                    onChange={e =>
                      field.onChange(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{CATEGORY_LABELS.ACTIVE}</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {children}
      </form>
    </Form>
  );
};
