'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useOptimistic, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateReview } from './useCreateReview';
import { useUpdateReview } from './useUpdateReview';
import { ReviewFormSchema, ReviewUpdateSchema } from '../../model/schemas';

interface UseReviewFormProps {
  poemId: string;
  reviewId?: string | null;
  initialData?: {
    title: string;
    content: string;
    rating: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useReviewForm = ({
  poemId,
  reviewId,
  initialData = { title: '', content: '', rating: 5 },
  onSuccess,
  onCancel,
}: UseReviewFormProps) => {
  const isEditing = Boolean(reviewId);
  const [data, setData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createReview } = useCreateReview({ onSuccess });
  const { updateReview } = useUpdateReview({ onSuccess });

  // Используем useOptimistic для мгновенного обновления UI
  const [optimisticData, addOptimisticData] = useOptimistic(
    data,
    (state, newData: typeof data) => newData
  );

  const form = useForm({
    resolver: zodResolver(isEditing ? ReviewUpdateSchema : ReviewFormSchema),
    defaultValues: {
      title: initialData.title,
      content: initialData.content,
      rating: initialData.rating,
    },
  });

  const handleDataChange = useCallback(
    (newData: typeof data) => {
      setData(newData);
      form.setValue('title', newData.title);
      form.setValue('content', newData.content);
      form.setValue('rating', newData.rating);
    },
    [form]
  );

  const handleRatingChange = useCallback(
    (rating: number) => {
      setData(prev => ({ ...prev, rating }));
      form.setValue('rating', rating);
    },
    [form]
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // Оптимистичное обновление UI в startTransition
      startTransition(() => {
        addOptimisticData(data);
      });

      if (!isEditing) {
        const result = await createReview(poemId, data);
        if (result.success) {
          setData({ title: '', content: '', rating: 5 });
          onSuccess?.();
        }
      } else if (reviewId) {
        const result = await updateReview(reviewId, data);
        if (result.success) {
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [data, poemId, reviewId, isEditing, addOptimisticData, createReview, updateReview]);

  const handleCancel = useCallback(() => {
    setData(initialData);
    form.reset();
    onCancel?.();
  }, [form, initialData, onCancel]);

  const canSubmit = data.content.trim().length > 0 && !isSubmitting;

  return {
    data,
    optimisticData,
    isSubmitting,
    isEditing,
    form,
    handleDataChange,
    handleRatingChange,
    handleSubmit,
    handleCancel,
    canSubmit,
  };
};
