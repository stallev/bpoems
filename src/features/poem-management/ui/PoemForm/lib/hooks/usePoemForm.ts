'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { convertQuillToPoemBlocks } from '../utils/poemContentConverter';
import { generateSlug } from '../utils/poemValidation';

// Define types locally to avoid import issues
interface PoemContentBlock {
  order: number;
  textType: 'paragraph' | 'image' | 'heading' | 'quote' | 'break';
  content: string;
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    color?: string;
    backgroundColor?: string;
  } | null;
  emoji: string | null;
  altText: string | null;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  customStyles?: Record<string, unknown>;
}

interface PoemFormData {
  title: string;
  slug: string;
  description?: string;
  content: PoemContentBlock[];
  categoryId?: string;
  tags: string[];
  isPublished: boolean;
  language: 'EN' | 'RU' | 'UA';
}

interface UsePoemFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<PoemFormData>;
  onSubmit: (data: PoemFormData) => Promise<void>;
}

export const usePoemForm = ({ mode, initialData, onSubmit }: UsePoemFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PoemFormData>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: [],
      categoryId: '',
      tags: [],
      isPublished: false,
      language: 'EN',
      ...initialData,
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = useCallback(
    (title: string) => {
      if (mode === 'create' && title) {
        const generatedSlug = generateSlug(title);
        form.setValue('slug', generatedSlug);
      }
    },
    [mode, form]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (data: PoemFormData) => {
      try {
        setIsLoading(true);
        setError(null);

        // Convert Quill content to PoemContentBlock[] if needed
        if (typeof data.content === 'object' && 'ops' in data.content) {
          data.content = convertQuillToPoemBlocks(data.content as any);
        }

        await onSubmit(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit]
  );

  // Reset form
  const resetForm = useCallback(() => {
    form.reset();
    setError(null);
  }, [form]);

  // Set form error
  const setFormError = useCallback((message: string) => {
    setError(message);
  }, []);

  return {
    form,
    isLoading,
    error,
    handleTitleChange,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm,
    setFormError,
  };
};
