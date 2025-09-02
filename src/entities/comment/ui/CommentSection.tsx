'use client';

import { useCommentSection } from '@/features/comment/lib/hooks/useCommentSection';
import { useDeleteComment } from '@/features/comment/lib/hooks/useDeleteComment';
import { CommentForm } from '@/features/comment/ui/CommentForm';
import { COMMENT_SECTION_LABELS } from '@/shared/constants/ui';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { CommentsList } from './CommentsList';
import type { CommentSectionProps } from '../model/types';

/**
 * CommentSection component for displaying and managing comments
 */
export function CommentSection({ poemId, comments, currentUserId }: CommentSectionProps) {
  const {
    isAdding,
    isEditing,
    editingCommentId,
    text,
    startAdding,
    startEditing,
    cancel,
    // setText не используется напрямую, но передается в CommentForm
    submit,
    // deleteComment не используется, так как используется handleDeleteComment из useDeleteComment
  } = useCommentSection(poemId);

  // Используем optimistic данные для комментариев
  const { deleteComment: handleDeleteComment, optimisticComments } = useDeleteComment({
    comments,
  });

  const UI_CONSTANTS = COMMENT_SECTION_LABELS;

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
          }
        }}
        onDeleteComment={handleDeleteComment}
        onEditSuccess={submit}
        onEditCancel={cancel}
        isEditing={isEditing}
        editingCommentId={editingCommentId}
      />

      <CommentForm
        poemId={poemId}
        commentId={editingCommentId}
        initialContent={text}
        isVisible={isAdding}
        isAuthenticated={!!currentUserId}
        onSuccess={submit}
        onCancel={cancel}
        onShowForm={startAdding}
        labels={UI_CONSTANTS}
      />
    </section>
  );
}
