'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { poemFormSchema } from '../../model/schemas';
import type { PoemFormData } from '../../model/types';

export const usePoemForm = () => {
  return useForm<PoemFormData>({
    resolver: zodResolver(poemFormSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      content: [],
    },
  });
};
