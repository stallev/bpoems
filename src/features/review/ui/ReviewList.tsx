'use client';

import { useState } from 'react';
import { ReviewWithRelations } from '@/entities/review';
import { ClaimModal } from '@/features/moderation';
import { ClaimResourceType } from '@/features/moderation/model/types';
import { formatDate } from '@/shared/lib/utils/formatDate';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { UIConstants } from '../constants/ui';

interface ReviewListProps {
  reviews: ReviewWithRelations[];
  onDelete?: (reviewId: string) => void;
  onEdit?: (reviewId: string) => void;
}

export function ReviewList({ reviews, onDelete, onEdit }: ReviewListProps) {
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);

  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">{UIConstants.NO_REVIEWS_MESSAGE}</div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <article key={review.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                {review.user.name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
              <div>
                <div className="font-medium">{review.user.name}</div>
                <time
                  dateTime={review.createdAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(review.createdAt)}
                </time>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setReportingReviewId(review.id)}>
                {UIConstants.REPORT_BUTTON}
              </Button>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(review.id)}>
                  {UIConstants.EDIT_BUTTON}
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(review.id)}>
                  {UIConstants.DELETE_BUTTON}
                </Button>
              )}
            </div>
          </header>
          <div className="text-sm">{review.content}</div>
        </article>
      ))}
      {reportingReviewId && (
        <ClaimModal
          isOpen={true}
          onClose={() => setReportingReviewId(null)}
          resourceId={reportingReviewId}
          resourceType={ClaimResourceType.REVIEW}
        />
      )}
    </div>
  );
}
