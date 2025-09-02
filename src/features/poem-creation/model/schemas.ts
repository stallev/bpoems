import { z } from 'zod';

// Schema for Tiptap JSON content structure
const tiptapJsonSchema = z.object({
  type: z.string(),
  content: z.array(
    z.object({
      type: z.string(),
      content: z
        .array(
          z.object({
            type: z.string(),
            text: z.string().optional(),
            marks: z
              .array(
                z.object({
                  type: z.string(),
                  attrs: z.record(z.string(), z.any()).optional(),
                })
              )
              .optional(),
          })
        )
        .optional(),
      text: z.string().optional(),
      marks: z
        .array(
          z.object({
            type: z.string(),
            attrs: z.record(z.string(), z.any()).optional(),
          })
        )
        .optional(),
    })
  ),
});

// Main form schema for poem creation/editing
export const poemFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Заголовок обязателен')
    .max(255, 'Заголовок не может превышать 255 символов')
    .trim(),
  categoryId: z.string().min(1, 'Категория обязательна'),
  content: tiptapJsonSchema.refine(content => {
    // Проверяем, что контент содержит хотя бы один параграф с текстом
    if (!content.content || content.content.length === 0) {
      return false;
    }

    // Подсчитываем общее количество символов
    let totalCharacters = 0;

    for (const block of content.content) {
      if (block.text) {
        totalCharacters += block.text.trim().length;
      }
      if (block.content) {
        for (const textBlock of block.content) {
          if (textBlock.text) {
            totalCharacters += textBlock.text.trim().length;
          }
        }
      }
    }

    return totalCharacters >= 6;
  }, 'Стихотворение должно содержать не менее 6 символов'),
});

// Type inference from schema
export type PoemFormSchema = z.infer<typeof poemFormSchema>;
