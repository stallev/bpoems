'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTiptapUtils } from './useTiptapUtils';
import { poemFormSchema } from '../../model/schemas';
import type { PoemFormData, UsePoemFormParams } from '../../model/types';

export const usePoemForm = ({ defaultValues, onSuccess, onCancel }: UsePoemFormParams = {}) => {
  const form = useForm<PoemFormData>({
    resolver: zodResolver(poemFormSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      content: {
        type: 'doc',
        content: [],
      },
      ...defaultValues,
    },
  });

  const { prepareFormData } = useTiptapUtils();

  const handleSubmit = useCallback(
    (data: PoemFormData) => {
      const formData = prepareFormData(data);
      if (onSuccess) {
        onSuccess({ id: data.id || '', slug: '' });
      }
      return formData;
    },
    [onSuccess, prepareFormData]
  );

  const handleCancel = useCallback(() => {
    // Reset form to default values
    form.reset({
      title: '',
      categoryId: '',
      content: {
        type: 'doc',
        content: [],
      },
      ...defaultValues,
    });

    // Call onCancel callback if provided
    if (onCancel) {
      onCancel();
    }
  }, [form, defaultValues, onCancel]);

  // Set default values if provided
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        form.setValue(key as keyof PoemFormData, value);
      });
    }
  }, [defaultValues, form]);

  return {
    form,
    handleSubmit,
    handleCancel,
  };
};
