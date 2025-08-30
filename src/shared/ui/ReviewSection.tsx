'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/shared/lib/utils/formatDate';
import { Button } from './shadcnComponents/button';
import { Textarea } from './shadcnComponents/textarea';

interface Review {
  id: string;
  rating?: number;
  content: string;
  author: {
    id: string;
    name: string | null;
    image?: string;
  };
  createdAt: Date;
}

interface ReviewSectionProps {
  poemId: string;
  reviews: Review[];
  className?: string;
}

/**
 * Component for displaying and creating reviews
 */
export const ReviewSection = ({ poemId, reviews, className }: ReviewSectionProps) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmitReview = () => {
    // TODO: Implement review submission
    console.log('Submit review:', { poemId, rating, content });
  };

  return (
    <section className={`space-y-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold text-foreground">Отзывы</h2>

      {/* Review Form */}
      <div className="bg-muted/30 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Ваш отзыв</h3>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Оценка</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded transition-colors ${
                  star <= rating
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-muted-foreground hover:text-yellow-400'
                }`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-4">
          <label htmlFor="review-content" className="block text-sm font-medium mb-2">
            Ваш отзыв
          </label>
          <Textarea
            id="review-content"
            placeholder="Поделитесь своими мыслями об этом стихотворении..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <Button
          onClick={handleSubmitReview}
          disabled={!rating || !content.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Опубликовать отзыв
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map(review => <ReviewItem key={review.id} review={review} />)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Пока нет отзывов. Будьте первым!</p>
          </div>
        )}
      </div>
    </section>
  );
};

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <div className="bg-background rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {review.author.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <span className="font-medium text-foreground">{review.author.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= (review.rating || 0)
                  ? 'text-yellow-400 fill-current'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-foreground leading-relaxed">{review.content}</p>
      <div className="mt-3 text-sm text-muted-foreground">{formatDate(review.createdAt)}</div>
    </div>
  );
};
