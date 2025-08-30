import { z } from 'zod';

// Schema for text content block within PoemContentBlock
const textContentSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1, 'Текст не может быть пустым').max(10000, 'Текст слишком длинный'),
  marks: z
    .array(
      z.object({
        type: z.enum(['bold', 'italic', 'underline', 'strike']),
        attrs: z.record(z.string(), z.any()).optional(),
      })
    )
    .optional(),
});

// Schema for PoemContentBlock (Tiptap-compatible)
const poemContentBlockSchema = z.object({
  type: z.literal('paragraph'),
  content: z
    .array(textContentSchema)
    .min(1, 'Параграф должен содержать хотя бы один текстовый блок'),
  order: z.number().int().min(0).optional(),
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
    .refine(blocks => {
      const totalCharacters = blocks.reduce((total, block) => {
        return (
          total +
          block.content.reduce((blockTotal, textBlock) => {
            return blockTotal + textBlock.text.trim().length;
          }, 0)
        );
      }, 0);
      return totalCharacters >= 6;
    }, 'Стихотворение должно содержать не менее 6 символов'),
});

// Type inference from schema
export type PoemFormSchema = z.infer<typeof poemFormSchema>;
