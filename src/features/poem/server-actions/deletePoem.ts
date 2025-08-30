'use server';

import { revalidatePath } from 'next/cache';
import { poemRepository } from '@/entities/poem';
import { auth } from '@/shared/api/auth/auth';

// UI Constants for delete poem functionality
const UI_CONSTANTS = {
  SUCCESS_MESSAGE: 'Стихотворение успешно удалено',
  ERROR_MESSAGES: {
    ACCESS_DENIED: 'Доступ запрещен. Необходима авторизация.',
    NOT_FOUND: 'Стихотворение не найдено.',
    NOT_AUTHOR: 'Вы не являетесь автором этого стихотворения.',
    DELETE_FAILED: 'Ошибка при удалении стихотворения.',
    UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
  },
} as const;

interface DeletePoemResult {
  success: boolean;
  message: string;
}

/**
 * Server action for deleting a poem
 * Only the author can delete their own poem
 */
export async function deletePoem(poemId: string): Promise<DeletePoemResult> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: UI_CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED,
      };
    }

    // 2. Get poem with author information
    const poem = await poemRepository.findById(poemId);
    if (!poem) {
      return {
        success: false,
        message: UI_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      };
    }

    // 3. Authorization check - only author can delete
    if (poem.authorId !== session.user.id) {
      return {
        success: false,
        message: UI_CONSTANTS.ERROR_MESSAGES.NOT_AUTHOR,
      };
    }

    // 4. Delete the poem
    await poemRepository.delete(poemId);

    // 5. Cache revalidation
    revalidatePath('/profile');
    revalidatePath('/poems');
    revalidatePath(`/poems/${poem.slug}`);

    // 6. Success response
    return {
      success: true,
      message: UI_CONSTANTS.SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error('Error deleting poem:', error);

    return {
      success: false,
      message: UI_CONSTANTS.ERROR_MESSAGES.DELETE_FAILED,
    };
  }
}
