import { z } from 'zod';

export const categoryFormSchema = z.object({
  translations: z.object({
    EN: z
      .string()
      .min(2, 'Название должно содержать минимум 2 символа')
      .max(50, 'Название не должно превышать 50 символов')
      .trim(),
    RU: z
      .string()
      .min(2, 'Название должно содержать минимум 2 символа')
      .max(50, 'Название не должно превышать 50 символов')
      .trim(),
    UA: z
      .string()
      .min(2, 'Название должно содержать минимум 2 символа')
      .max(50, 'Название не должно превышать 50 символов')
      .trim(),
  }),
  isActive: z.boolean(),
  order: z
    .number()
    .min(0, 'Порядковый номер должен быть от 0 до 1000')
    .max(1000, 'Порядковый номер должен быть от 0 до 1000')
    .optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
