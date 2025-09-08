import { useState, useCallback, useRef } from 'react';
import { useCreateReview } from './useCreateReview';

export interface ReviewData {
  title: string;
  content: string;
  rating: number;
}

export interface UseReviewSectionResult {
  isAdding: boolean;
  isEditing: boolean;
  editingReviewId: string | null;
  data: ReviewData;
  canSubmit: boolean;
  startAdding: () => void;
  startEditing: (reviewId: string, reviewData: ReviewData) => void;
  cancel: () => void;
  setData: (update: Partial<ReviewData>) => void;
  setRating: (rating: number) => void;
  submit: () => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

export const useReviewSection = (poemId: string): UseReviewSectionResult => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [data, setDataState] = useState<ReviewData>({ title: '', content: '', rating: 5 });

  // Реф для предотвращения множественных вызовов
  const isSubmittingRef = useRef(false);

  const { createReview } = useCreateReview();

  const startAdding = useCallback(() => {
    // Если форма уже открыта, не делаем ничего
    if (isAdding) return;

    setIsAdding(true);
    setIsEditing(false);
    setEditingReviewId(null);
    setDataState({ title: '', content: '', rating: 5 });
  }, [isAdding]);

  const startEditing = useCallback(
    (reviewId: string, reviewData: ReviewData) => {
      // Если редактируем тот же отзыв, не делаем ничего
      if (editingReviewId === reviewId) return;

      setIsEditing(true);
      setIsAdding(false);
      setEditingReviewId(reviewId);
      setDataState(reviewData);
    },
    [editingReviewId]
  );

  const cancel = useCallback(() => {
    setDataState({ title: '', content: '', rating: 5 });
    setIsAdding(false);
    setIsEditing(false);
    setEditingReviewId(null);
  }, []);

  const setData = useCallback((update: Partial<ReviewData>) => {
    setDataState(prev => ({ ...prev, ...update }));
  }, []);

  const setRating = useCallback((rating: number) => setData({ rating }), [setData]);

  const submit = useCallback(async () => {
    // Предотвращаем множественную отправку
    if (isSubmittingRef.current) return;

    const trimmedContent = data.content.trim();
    if (!trimmedContent) return;

    try {
      isSubmittingRef.current = true;

      if (isEditing && editingReviewId) {
        // Редактирование обрабатывается в форме
        return;
      } else {
        const result = await createReview(poemId, data);

        if (result.success) {
          setDataState({ title: '', content: '', rating: 5 });
          setIsAdding(false);
        }
      }
    } finally {
      isSubmittingRef.current = false;
    }
  }, [data, poemId, isEditing, editingReviewId, createReview]);

  const deleteReviewHandler = useCallback(async () => {
    // Заглушка для совместимости
  }, []);

  return {
    isAdding,
    isEditing,
    editingReviewId,
    data,
    canSubmit: !!data.content.trim(),
    startAdding,
    startEditing,
    cancel,
    setData,
    setRating,
    submit,
    deleteReview: deleteReviewHandler,
  };
};
