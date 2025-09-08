'use server';

import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { reviewRepository } from '@/entities/review';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { UIConstants } from '../constants/ui';
import { ReviewFormSchema } from '../model/schemas';

export async function createReview(poemId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }

    if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new Error(ErrorMessages.INSUFFICIENT_PERMISSIONS);
    }

    const rawData = {
      content: formData.get('content') as string,
      ...(formData.has('rating') && { rating: Number(formData.get('rating')) }),
      ...(formData.has('title') && { title: formData.get('title') as string }),
    };

    const validatedData = ReviewFormSchema.parse(rawData);

    const sanitizedContent = sanitizeHtml(validatedData.content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const review = await reviewRepository.create({
      content: sanitizedContent,
      userId: session.user.id,
      poemId: poemId,
      rating: validatedData.rating,
      title: validatedData.title,
    });
    console.log('review', review);

    revalidatePath(`/poems/${review.poemId}`);

    return {
      success: true,
      message: UIConstants.REVIEW_SUCCESS_MESSAGE,
      data: review,
    };
  } catch (error) {
    console.error('Error creating review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
