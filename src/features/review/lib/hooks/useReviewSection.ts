import { useState, useCallback } from 'react';
import { useCreateReview } from './useCreateReview';
import { useDeleteReview } from './useDeleteReview';
import { useUpdateReview } from './useUpdateReview';

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

  const { createReview } = useCreateReview();
  const { updateReview } = useUpdateReview();
  const { deleteReview: handleDeleteReview } = useDeleteReview();

  const startAdding = useCallback(() => {
    setIsAdding(true);
    setIsEditing(false);
    setEditingReviewId(null);
    setDataState({ title: '', content: '', rating: 5 });
  }, []);

  const startEditing = useCallback((reviewId: string, reviewData: ReviewData) => {
    setIsEditing(true);
    setIsAdding(false);
    setEditingReviewId(reviewId);
    setDataState(reviewData);
  }, []);

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
    if (!data.content.trim()) return;

    if (isEditing && editingReviewId) {
      // Update existing review
      const result = await updateReview(editingReviewId, data);
      if (result.success) {
        setDataState({ title: '', content: '', rating: 5 });
        setIsEditing(false);
        setEditingReviewId(null);
      }
    } else {
      // Create new review
      const result = await createReview(poemId, data);
      if (result.success) {
        setDataState({ title: '', content: '', rating: 5 });
        setIsAdding(false);
      }
    }
  }, [data, poemId, isEditing, editingReviewId, updateReview, createReview]);

  const deleteReviewHandler = useCallback(
    async (reviewId: string) => {
      await handleDeleteReview(reviewId);
    },
    [handleDeleteReview]
  );

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
