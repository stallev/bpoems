'use client';

import { useState, useCallback } from 'react';
import { useCommentSection } from '@/features/comment/lib/hooks/useCommentSection';
import { useDeleteComment } from '@/features/comment/lib/hooks/useDeleteComment';
import { CommentForm } from '@/features/comment/ui/CommentForm';
import { COMMENT_SECTION_LABELS } from '@/shared/constants/ui';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { CommentsList } from './CommentsList';
import type { CommentSectionProps } from '../model/types';

export function CommentSection({ poemId, comments, currentUserId }: CommentSectionProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { isEditing, editingCommentId, text, startAdding, startEditing, cancel, submit } =
    useCommentSection(poemId);

  const { deleteComment: handleDeleteComment, optimisticComments } = useDeleteComment({ comments });

  const handleStartAdding = useCallback(() => {
    startAdding();
    setIsFormVisible(true);
  }, [startAdding]);

  const handleSuccess = useCallback(() => {
    cancel();
    setIsFormVisible(false);
  }, [cancel]);

  return (
    <section className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm space-y-4">
      <SectionHeader title="Комментарии" count={comments.length} />

      <CommentsList
        comments={(optimisticComments || comments).map(comment => ({
          ...comment,
          poemId: poemId,
        }))}
        currentUserId={currentUserId}
        onEditComment={(id: string) => {
          const comment = comments.find(c => c.id === id);
          if (comment) {
            startEditing(id, comment.content);
            setIsFormVisible(true);
          }
        }}
        onDeleteComment={handleDeleteComment}
        onEditSuccess={submit}
        onEditCancel={() => {
          cancel();
          setIsFormVisible(false);
        }}
        isEditing={isEditing}
        editingCommentId={editingCommentId}
      />

      {!isFormVisible && currentUserId && (
        <div className="flex justify-center sm:justify-end">
          <Button onClick={handleStartAdding} variant="outline" className="w-full sm:w-auto">
            {COMMENT_SECTION_LABELS.ADD_COMMENT}
          </Button>
        </div>
      )}

      {isFormVisible && (
        <CommentForm
          poemId={poemId}
          commentId={editingCommentId}
          initialContent={text}
          isVisible={true}
          isAuthenticated={!!currentUserId}
          onSuccess={handleSuccess}
          onCancel={() => {
            cancel();
            setIsFormVisible(false);
          }}
          onShowForm={handleStartAdding}
          labels={COMMENT_SECTION_LABELS}
        />
      )}
    </section>
  );
}
