'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useOptimistic, startTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateComment } from './useCreateComment';
import { useUpdateComment } from './useUpdateComment';
import { CommentFormSchema, CommentUpdateSchema } from '../../model/schemas';

interface UseCommentFormProps {
  poemId: string;
  commentId?: string | null;
  initialContent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useCommentForm = ({
  poemId,
  commentId,
  initialContent = '',
  onSuccess,
  onCancel,
}: UseCommentFormProps) => {
  const isEditing = Boolean(commentId);
  const [text, setText] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createComment } = useCreateComment({ onSuccess });
  const { updateComment } = useUpdateComment({ onSuccess });

  // Используем useOptimistic для мгновенного обновления UI
  const [optimisticText, addOptimisticText] = useOptimistic(
    text,
    (state, newText: string) => newText
  );

  const form = useForm({
    resolver: zodResolver(isEditing ? CommentUpdateSchema : CommentFormSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);
      form.setValue('content', value);
    },
    [form]
  );

  useEffect(() => {
    console.log('comment text value', text);
  }, [text]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // Оптимистичное обновление UI в startTransition
      startTransition(() => {
        addOptimisticText(text);
      });

      if (!isEditing) {
        const result = await createComment(poemId, text);
        if (result.success) {
          setText('');
          onSuccess?.();
        }
      } else if (commentId) {
        const result = await updateComment(commentId, text);
        if (result.success) {
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [text, poemId, commentId, isEditing, addOptimisticText, createComment, updateComment]);

  const handleCancel = useCallback(() => {
    setText(initialContent);
    form.reset();
    onCancel?.();
  }, [form, initialContent, onCancel]);

  const canSubmit = text.trim().length > 0 && !isSubmitting;

  return {
    text,
    optimisticText,
    isSubmitting,
    isEditing,
    form,
    handleTextChange,
    handleSubmit,
    handleCancel,
    canSubmit,
  };
};
