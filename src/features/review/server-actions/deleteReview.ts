'use server';

import { revalidatePath } from 'next/cache';
import { reviewRepository } from '@/entities/review';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { UIConstants } from '../constants/ui';

export async function deleteReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }

    if (!['SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
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
      throw new Error('У вас нет прав для удаления этого отзыва');
    }

    await reviewRepository.delete(reviewId);

    revalidatePath(`/poems/${existingReview.poemId}`);

    return {
      success: true,
      message: UIConstants.REVIEW_DELETE_SUCCESS_MESSAGE || 'Отзыв успешно удален',
    };
  } catch (error) {
    console.error('Error deleting review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
