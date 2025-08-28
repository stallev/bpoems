import { z } from 'zod';

export const ReviewFormSchema = z.object({
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review cannot exceed 2000 characters'),
  rating: z
    .number()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  poemId: z.string().min(1, 'Poem ID is required'),
});

export type ReviewFormData = z.infer<typeof ReviewFormSchema>;
