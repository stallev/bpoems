import { z } from 'zod';

export const ReviewFormSchema = z.object({
  title: z.string().max(200, 'Review title cannot exceed 200 characters').optional(),
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review cannot exceed 2000 characters'),
  rating: z
    .number()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .optional(),
  poemId: z.string().min(1, 'Poem ID is required'),
});

export const ReviewUpdateSchema = z.object({
  title: z.string().max(200, 'Review title cannot exceed 200 characters').optional(),
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review cannot exceed 2000 characters'),
  rating: z
    .number()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .optional(),
});

export type ReviewFormData = z.infer<typeof ReviewFormSchema>;
export type ReviewUpdateData = z.infer<typeof ReviewUpdateSchema>;
