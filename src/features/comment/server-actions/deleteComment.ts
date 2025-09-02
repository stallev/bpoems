'use server';

import { revalidatePath } from 'next/cache';
import { commentRepository } from '@/entities/comment';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { UIConstants } from '../constants/ui';

export async function deleteComment(commentId: string) {
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
      throw new Error('У вас нет прав для удаления этого комментария');
    }

    await commentRepository.delete(commentId);

    revalidatePath(`/poems/${existingComment.poemId}`);

    return {
      success: true,
      message: UIConstants.COMMENT_DELETE_SUCCESS_MESSAGE || 'Комментарий успешно удален',
    };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
