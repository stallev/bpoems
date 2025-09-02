import { useState, useCallback } from 'react';
import { useCreateComment } from './useCreateComment';
import { useDeleteComment } from './useDeleteComment';
import { useUpdateComment } from './useUpdateComment';

export interface UseCommentSectionResult {
  isAdding: boolean;
  isEditing: boolean;
  editingCommentId: string | null;
  text: string;
  canSubmit: boolean;
  startAdding: () => void;
  startEditing: (commentId: string, content: string) => void;
  cancel: () => void;
  setText: (value: string) => void;
  submit: () => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export const useCommentSection = (poemId: string): UseCommentSectionResult => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [text, setText] = useState('');

  const { createComment } = useCreateComment();
  const { updateComment } = useUpdateComment();
  const { deleteComment: handleDeleteComment } = useDeleteComment();

  const startAdding = useCallback(() => {
    setIsAdding(true);
    setIsEditing(false);
    setEditingCommentId(null);
    setText('');
  }, []);

  const startEditing = useCallback((commentId: string, content: string) => {
    setIsEditing(true);
    setIsAdding(false);
    setEditingCommentId(commentId);
    setText(content);
  }, []);

  const cancel = useCallback(() => {
    setText('');
    setIsAdding(false);
    setIsEditing(false);
    setEditingCommentId(null);
  }, []);

  const submit = useCallback(async () => {
    if (!text.trim()) return;

    if (isEditing && editingCommentId) {
      // Update existing comment
      const result = await updateComment(editingCommentId, text.trim());
      if (result.success) {
        setText('');
        setIsEditing(false);
        setEditingCommentId(null);
      }
    } else {
      // Create new comment
      const result = await createComment(poemId, text.trim());
      if (result.success) {
        setText('');
        // Скрываем форму после добавления комментария
        setIsAdding(false);
      }
    }
  }, [text, poemId, isEditing, editingCommentId, updateComment, createComment]);

  const deleteCommentHandler = useCallback(
    async (commentId: string) => {
      await handleDeleteComment(commentId);
    },
    [handleDeleteComment]
  );

  return {
    isAdding,
    isEditing,
    editingCommentId,
    text,
    canSubmit: !!text.trim(),
    startAdding,
    startEditing,
    cancel,
    setText,
    submit,
    deleteComment: deleteCommentHandler,
  };
};
