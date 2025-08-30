'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { PostClaimButton } from './PostClaimButton';
import { Button } from './shadcnComponents/button';
import { Input } from './shadcnComponents/input';
import { Textarea } from './shadcnComponents/textarea';
import type { ReviewSectionProps } from './types';
import { REVIEW_SECTION_LABELS } from '../constants/ui';

/**
 * ReviewSection component for displaying and managing reviews
 *
 * @param props - Component props
 * @param props.poemId - ID of the poem
 * @param props.reviews - Array of reviews
 * @param props.currentUserId - Current user ID
 * @param props.poemAuthorId - ID of the poem author
 *
 * @example
 * ```tsx
 * <ReviewSection
 *   poemId="poem-123"
 *   reviews={reviews}
 *   currentUserId="user-456"
 *   poemAuthorId="author-789"
 * />
 * ```
 */
export const ReviewSection = ({ reviews, currentUserId, poemAuthorId }: ReviewSectionProps) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    title: '',
    content: '',
    rating: 5,
  });

  // UI Constants for review section
  const UI_CONSTANTS = {
    NO_REVIEWS_MESSAGE: REVIEW_SECTION_LABELS.NO_REVIEWS_MESSAGE,
    ADD_REVIEW: REVIEW_SECTION_LABELS.ADD_REVIEW,
    REVIEW_TITLE_PLACEHOLDER: REVIEW_SECTION_LABELS.REVIEW_TITLE_PLACEHOLDER,
    REVIEW_CONTENT_PLACEHOLDER: REVIEW_SECTION_LABELS.REVIEW_CONTENT_PLACEHOLDER,
    RATING_LABEL: REVIEW_SECTION_LABELS.RATING_LABEL,
    SUBMIT_REVIEW: REVIEW_SECTION_LABELS.SUBMIT_REVIEW,
    CANCEL_REVIEW: REVIEW_SECTION_LABELS.CANCEL_REVIEW,
  } as const;

  const handleSubmitReview = async () => {
    // TODO: Implement review submission
    // console.log('Submitting review:', reviewData);
    setReviewData({ title: '', content: '', rating: 5 });
    setIsAddingReview(false);
  };

  const handleCancelReview = () => {
    setReviewData({ title: '', content: '', rating: 5 });
    setIsAddingReview(false);
  };

  const handleRatingChange = (rating: number) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  return (
    <section className="space-y-4">
      <SectionHeader title="Отзывы" count={reviews.length} />

      <ReviewsList reviews={reviews} currentUserId={currentUserId} />

      <ReviewForm
        isVisible={isAddingReview}
        reviewData={reviewData}
        onReviewDataChange={setReviewData}
        onRatingChange={handleRatingChange}
        onSubmit={handleSubmitReview}
        onCancel={handleCancelReview}
        onShowForm={() => setIsAddingReview(true)}
        isAuthenticated={!!currentUserId}
        isAuthor={currentUserId === poemAuthorId}
        labels={UI_CONSTANTS}
      />
    </section>
  );
};

/**
 * Section header component
 */
const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <span className="text-sm text-muted-foreground">{count} отзывов</span>
  </div>
);

/**
 * Reviews list component
 */
const ReviewsList = ({
  reviews,
  currentUserId,
}: {
  reviews: ReviewSectionProps['reviews'];
  currentUserId?: string;
}) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Отзывы отсутствуют</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <ReviewItem key={review.id} review={review} currentUserId={currentUserId} />
      ))}
    </div>
  );
};

/**
 * Individual review item component
 */
const ReviewItem = ({
  review,
  currentUserId,
}: {
  review: ReviewSectionProps['reviews'][0];
  currentUserId?: string;
}) => {
  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: ru });
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground">{review.user.name}</span>
            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Оценка:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {review.title && <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>}

          <p className="text-sm text-foreground leading-relaxed">{review.content}</p>
        </div>

        {currentUserId && currentUserId !== review.user.id && (
          <PostClaimButton poemId={review.id} isAuthor={false} />
        )}
      </div>
    </div>
  );
};

/**
 * Review form component
 */
const ReviewForm = ({
  isVisible,
  reviewData,
  onReviewDataChange,
  onRatingChange,
  onSubmit,
  onCancel,
  onShowForm,
  isAuthenticated,
  isAuthor,
  labels,
}: {
  isVisible: boolean;
  reviewData: { title: string; content: string; rating: number };
  onReviewDataChange: (data: { title: string; content: string; rating: number }) => void;
  onRatingChange: (rating: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onShowForm: () => void;
  isAuthenticated: boolean;
  isAuthor: boolean;
  labels: typeof REVIEW_SECTION_LABELS;
}) => {
  if (!isAuthenticated) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>Войдите, чтобы оставить отзыв</p>
      </div>
    );
  }

  if (isAuthor) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>Авторы не могут оставлять отзывы на свои стихотворения</p>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <Button onClick={onShowForm} variant="outline" className="w-full">
        {labels.ADD_REVIEW}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        value={reviewData.title}
        onChange={e => onReviewDataChange({ ...reviewData, title: e.target.value })}
        placeholder={labels.REVIEW_TITLE_PLACEHOLDER}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.RATING_LABEL}</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= reviewData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <Textarea
        value={reviewData.content}
        onChange={e => onReviewDataChange({ ...reviewData, content: e.target.value })}
        placeholder={labels.REVIEW_CONTENT_PLACEHOLDER}
        className="min-h-[100px] resize-none"
      />

      <div className="flex gap-2">
        <Button onClick={onSubmit} disabled={!reviewData.content.trim()}>
          {labels.SUBMIT_REVIEW}
        </Button>
        <Button onClick={onCancel} variant="outline">
          {labels.CANCEL_REVIEW}
        </Button>
      </div>
    </div>
  );
};
