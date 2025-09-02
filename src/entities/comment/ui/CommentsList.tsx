'use client';

import { CommentItem } from './CommentItem';
import type { CommentsListProps } from '../model/types';

export function CommentsList({
  comments,
  currentUserId,
  onEditComment,
  onDeleteComment,
  onEditSuccess,
  onEditCancel,
  isEditing,
  editingCommentId,
}: CommentsListProps) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
          onEditSuccess={onEditSuccess}
          onEditCancel={onEditCancel}
          isEditing={isEditing}
          editingCommentId={editingCommentId}
        />
      ))}
    </div>
  );
}
