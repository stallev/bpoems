'use client';

import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CommentForm } from '@/features/comment/ui/CommentForm';
import { COMMENT_SECTION_LABELS } from '@/shared/constants/ui';
import { PostClaimButton } from '@/shared/ui/claim/PostClaimButton';
import { ConfirmationModal } from '@/shared/ui/modals/ConfirmationModal';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { simpleFormatDate } from '@/shared/ui/utils/dateFormatting';
import type { CommentItemProps } from '../model/types';

export function CommentItem({
  comment,
  currentUserId,
  onEditComment,
  onDeleteComment,
  onEditSuccess,
  onEditCancel,
  isEditing,
  editingCommentId,
}: CommentItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditingThisComment = isEditing && editingCommentId === comment.id;

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDeleteComment(comment.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // Если редактируется этот комментарий, показываем форму редактирования
  if (isEditingThisComment) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border">
        <CommentForm
          poemId={comment.poemId}
          commentId={comment.id}
          initialContent={comment.content}
          isVisible={true}
          isAuthenticated={!!currentUserId}
          onSuccess={onEditSuccess}
          onCancel={onEditCancel}
          onShowForm={() => {
            // Не используется при редактировании
          }}
          labels={COMMENT_SECTION_LABELS}
        />
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {simpleFormatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
        </div>

        <div className="flex items-center gap-2">
          {currentUserId && currentUserId !== comment.author.id && (
            <PostClaimButton poemId={comment.id} isAuthor={false} />
          )}
          {currentUserId && currentUserId === comment.author.id && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditComment(comment.id)}
                className="h-8 w-8 p-0 hover:bg-muted"
                title="Редактировать комментарий"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                title="Удалить комментарий"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Удалить комментарий"
        description="Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        isLoading={isDeleting}
      />
    </div>
  );
}
