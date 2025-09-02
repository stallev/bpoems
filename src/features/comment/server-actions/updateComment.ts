'use server';

import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { commentRepository } from '@/entities/comment';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { UIConstants } from '../constants/ui';
import { CommentUpdateSchema } from '../model/schemas';

export async function updateComment(commentId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }

    if (!['SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new Error(ErrorMessages.INSUFFICIENT_PERMISSIONS);
    }

    // Get the comment to check ownership
    const existingComment = await commentRepository.findById(commentId);
    if (!existingComment) {
      throw new Error('Комментарий не найден');
    }

    // Check if user is the author or has moderator/admin role
    if (
      existingComment.authorId !== session.user.id &&
      !['MODERATOR', 'ADMIN'].includes(session.user.role)
    ) {
      throw new Error('У вас нет прав для редактирования этого комментария');
    }

    const rawData = {
      content: formData.get('content') as string,
    };

    const validatedData = CommentUpdateSchema.parse(rawData);

    const sanitizedContent = sanitizeHtml(validatedData.content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const comment = await commentRepository.update(commentId, {
      content: sanitizedContent,
    });
    console.log('comment', comment);

    revalidatePath(`/poems/${existingComment.poemId}`);

    return {
      success: true,
      message: UIConstants.COMMENT_UPDATE_SUCCESS_MESSAGE,
      data: comment,
    };
  } catch (error) {
    console.error('Error updating comment:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
