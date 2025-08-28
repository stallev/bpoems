import { z } from 'zod';

export const CommentFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters'),
  poemId: z.string().min(1, 'Poem ID is required'),
});

export type CommentFormData = z.infer<typeof CommentFormSchema>;
