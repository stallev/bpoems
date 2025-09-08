import { useState, useCallback, useRef } from 'react';
import { useCreateComment } from './useCreateComment';

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

  // Реф для предотвращения множественных вызовов
  const isSubmittingRef = useRef(false);

  const { createComment } = useCreateComment();

  const startAdding = useCallback(() => {
    // Если форма уже открыта, не делаем ничего
    if (isAdding) return;

    setIsAdding(true);
    setIsEditing(false);
    setEditingCommentId(null);
    setText('');
  }, [isAdding]);

  const startEditing = useCallback(
    (commentId: string, content: string) => {
      // Если редактируем тот же комментарий, не делаем ничего
      if (editingCommentId === commentId) return;

      setIsEditing(true);
      setIsAdding(false);
      setEditingCommentId(commentId);
      setText(content);
    },
    [editingCommentId]
  );

  const cancel = useCallback(() => {
    setText('');
    setIsAdding(false);
    setIsEditing(false);
    setEditingCommentId(null);
  }, []);

  const submit = useCallback(async () => {
    // Предотвращаем множественную отправку
    if (isSubmittingRef.current) return;

    const trimmedText = text.trim();
    if (!trimmedText) return;

    try {
      isSubmittingRef.current = true;

      if (isEditing && editingCommentId) {
        // Редактирование обрабатывается в форме
        return;
      } else {
        const result = await createComment(poemId, trimmedText);

        if (result.success) {
          setText('');
          setIsAdding(false);
        }
      }
    } finally {
      isSubmittingRef.current = false;
    }
  }, [text, poemId, isEditing, editingCommentId, createComment]);

  const deleteCommentHandler = useCallback(async () => {
    // Заглушка для совместимости
  }, []);

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
