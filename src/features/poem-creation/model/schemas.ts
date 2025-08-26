import { z } from 'zod';

// Schema for PoemContentBlock
const poemContentBlockSchema = z.object({
  order: z.number().int().min(0),
  textType: z.literal('paragraph'),
  content: z.string().max(10000, 'Содержимое параграфа слишком длинное'),
  formatting: z
    .object({
      bold: z.boolean(),
      italic: z.boolean(),
      underline: z.boolean(),
    })
    .nullable(),
});

// Main form schema for poem creation/editing
export const poemFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Заголовок обязателен')
    .max(255, 'Заголовок не может превышать 255 символов')
    .trim(),
  categoryId: z.string().min(1, 'Категория обязательна'),
  content: z
    .array(poemContentBlockSchema)
    .min(1, 'Стихотворение должно содержать хотя бы один параграф')
    .max(100, 'Стихотворение не может содержать более 100 параграфов')
    .refine(
      blocks => blocks.some(block => block.content.trim().length > 0),
      'Стихотворение должно содержать хотя бы один параграф с текстом'
    ),
});

// Type inference from schema
export type PoemFormSchema = z.infer<typeof poemFormSchema>;
