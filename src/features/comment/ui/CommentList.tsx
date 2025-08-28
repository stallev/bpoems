'use client';

import { useState } from 'react';
import { CommentWithRelations } from '@/entities/comment';
import { ClaimModal } from '@/features/moderation';
import { ClaimResourceType } from '@/features/moderation/model/types';
import { formatDate } from '@/shared/lib/utils/formatDate';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { UIConstants } from '../constants/ui';

interface CommentListProps {
  comments: CommentWithRelations[];
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
}

export function CommentList({ comments, onDelete, onEdit }: CommentListProps) {
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);

  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {UIConstants.NO_COMMENTS_MESSAGE}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <article key={comment.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                {comment.author.name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
              <div>
                <div className="font-medium">{comment.author.name}</div>
                <time
                  dateTime={comment.createdAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(comment.createdAt)}
                </time>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setReportingCommentId(comment.id)}>
                {UIConstants.REPORT_BUTTON}
              </Button>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(comment.id)}>
                  {UIConstants.EDIT_BUTTON}
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(comment.id)}>
                  {UIConstants.DELETE_BUTTON}
                </Button>
              )}
            </div>
          </header>
          <div className="text-sm">{comment.content}</div>
        </article>
      ))}
      {reportingCommentId && (
        <ClaimModal
          isOpen={true}
          onClose={() => setReportingCommentId(null)}
          resourceId={reportingCommentId}
          resourceType={ClaimResourceType.COMMENT}
        />
      )}
    </div>
  );
}
