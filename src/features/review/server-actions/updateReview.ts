'use server';

import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { reviewRepository } from '@/entities/review';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { UIConstants } from '../constants/ui';
import { ReviewUpdateSchema } from '../model/schemas';

export async function updateReview(reviewId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }

    if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new Error(ErrorMessages.INSUFFICIENT_PERMISSIONS);
    }

    // Get the review to check ownership
    const existingReview = await reviewRepository.findById(reviewId);
    if (!existingReview) {
      throw new Error('Отзыв не найден');
    }

    // Check if user is the author or has moderator/admin role
    if (
      existingReview.userId !== session.user.id &&
      !['MODERATOR', 'ADMIN'].includes(session.user.role)
    ) {
      throw new Error('У вас нет прав для редактирования этого отзыва');
    }

    const rawData = {
      content: formData.get('content') as string,
      rating: formData.has('rating') ? Number(formData.get('rating')) : undefined,
      title: formData.has('title') ? (formData.get('title') as string) : undefined,
    };

    const validatedData = ReviewUpdateSchema.parse(rawData);

    const sanitizedContent = sanitizeHtml(validatedData.content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const review = await reviewRepository.update(reviewId, {
      content: sanitizedContent,
      rating: validatedData.rating,
      title: validatedData.title,
    });

    revalidatePath(`/poems/${existingReview.poemId}`);

    return {
      success: true,
      message: UIConstants.REVIEW_UPDATE_SUCCESS_MESSAGE,
      data: review,
    };
  } catch (error) {
    console.error('Error updating review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
