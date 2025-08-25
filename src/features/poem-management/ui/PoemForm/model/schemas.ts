import { z } from 'zod';
import { POEM_FORM_CONSTANTS } from '../../../model/constants';

export const poemContentBlockSchema = z.object({
  order: z.number().min(0),
  textType: z.enum(['paragraph', 'image', 'heading', 'quote', 'break']),
  content: z.string(),
  formatting: z
    .object({
      bold: z.boolean(),
      italic: z.boolean(),
      underline: z.boolean(),
      strikethrough: z.boolean(),
      color: z.string().optional(),
      backgroundColor: z.string().optional(),
    })
    .nullable(),
  emoji: z.string().nullable(),
  altText: z.string().nullable(),
  imageUrl: z.string().optional(),
  imageWidth: z.number().optional(),
  imageHeight: z.number().optional(),
  alignment: z.enum(['left', 'center', 'right', 'justify']).optional(),
  fontSize: z.number().optional(),
  fontFamily: z.string().optional(),
  lineHeight: z.number().optional(),
  marginTop: z.number().optional(),
  marginBottom: z.number().optional(),
  customStyles: z.record(z.string(), z.unknown()).optional(),
});

export const poemFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(
      POEM_FORM_CONSTANTS.MAX_TITLE_LENGTH,
      `Title must be ${POEM_FORM_CONSTANTS.MAX_TITLE_LENGTH} characters or less`
    ),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      POEM_FORM_CONSTANTS.SLUG_PATTERN,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  description: z
    .string()
    .max(
      POEM_FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH,
      `Description must be ${POEM_FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters or less`
    )
    .optional(),
  content: z
    .array(poemContentBlockSchema)
    .min(1, 'Content is required')
    .refine(blocks => {
      const textContent = blocks
        .filter(
          block =>
            block.textType === 'paragraph' ||
            block.textType === 'heading' ||
            block.textType === 'quote'
        )
        .map(block => block.content)
        .join(' ')
        .trim();
      return textContent.length >= POEM_FORM_CONSTANTS.MIN_CONTENT_LENGTH;
    }, `Content must be at least ${POEM_FORM_CONSTANTS.MIN_CONTENT_LENGTH} characters long`)
    .refine(blocks => {
      const imageBlocks = blocks.filter(block => block.textType === 'image');
      return imageBlocks.length <= POEM_FORM_CONSTANTS.MAX_IMAGES_COUNT;
    }, `Maximum ${POEM_FORM_CONSTANTS.MAX_IMAGES_COUNT} images allowed`),
  categoryId: z.string().optional(),
  tags: z
    .array(z.string())
    .max(
      POEM_FORM_CONSTANTS.MAX_TAGS_COUNT,
      `Maximum ${POEM_FORM_CONSTANTS.MAX_TAGS_COUNT} tags allowed`
    ),
  isPublished: z.boolean(),
  language: z.enum(['EN', 'RU', 'UA']),
});

export type PoemFormData = z.infer<typeof poemFormSchema>;
export type PoemContentBlock = z.infer<typeof poemContentBlockSchema>;
