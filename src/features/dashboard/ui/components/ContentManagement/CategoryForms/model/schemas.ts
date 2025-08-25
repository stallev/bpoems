import { z } from 'zod';

export const categoryFormSchema = z.object({
  translations: z.object({
    EN: z.string().min(2, 'Название должно содержать минимум 2 символа'),
    RU: z.string().min(2, 'Название должно содержать минимум 2 символа'),
    UA: z.string().min(2, 'Название должно содержать минимум 2 символа'),
  }),
  isActive: z.boolean(),
  order: z.number().optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
