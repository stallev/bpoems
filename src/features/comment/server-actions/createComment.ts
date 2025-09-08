'use server';

import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { commentRepository } from '@/entities/comment';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { UIConstants } from '../constants/ui';
import { CommentFormSchema } from '../model/schemas';

export async function createComment(poemId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }

    if (!['SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new Error(ErrorMessages.INSUFFICIENT_PERMISSIONS);
    }

    const rawData = {
      content: formData.get('content') as string,
    };

    const validatedData = CommentFormSchema.parse(rawData);

    const sanitizedContent = sanitizeHtml(validatedData.content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const comment = await commentRepository.create({
      content: sanitizedContent,
      authorId: session.user.id,
      poemId: poemId,
    });

    revalidatePath(`/poems/${comment.poemId}`);

    return {
      success: true,
      message: UIConstants.COMMENT_SUCCESS_MESSAGE,
      data: comment,
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
