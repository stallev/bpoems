import { z } from 'zod';

export const CommentFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters'),
});

export const CommentUpdateSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters'),
});

export type CommentFormData = z.infer<typeof CommentFormSchema>;
export type CommentUpdateData = z.infer<typeof CommentUpdateSchema>;
