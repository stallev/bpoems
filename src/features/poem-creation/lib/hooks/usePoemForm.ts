'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuillUtils } from './useQuillUtils';
import { poemFormSchema } from '../../model/schemas';
import type { PoemFormData, UsePoemFormParams } from '../../model/types';

export const usePoemForm = ({ defaultValues, onSuccess }: UsePoemFormParams = {}) => {
  const form = useForm<PoemFormData>({
    resolver: zodResolver(poemFormSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      content: [],
      ...defaultValues,
    },
  });

  const { getQuillValue, prepareFormData } = useQuillUtils();

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
    getQuillValue,
  };
};
