'use server';

import { revalidatePath } from 'next/cache';
import { poemRepository } from '@/entities/poem';
import { auth } from '@/shared/api/auth/auth';
import { ContentApprovalStatus } from '@/shared/constants/ContentStatus';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { getDefaultContentStatusForRole } from '@/shared/lib/utils/contentStatusUtils';
import { canCreateContent, canModerateContent } from '@/shared/lib/utils/roleUtils';
import { getRoutePath } from '@/shared/lib/utils/routeUtils';
import { POEM_ERRORS, POEM_SUCCESS, FORM_FIELDS } from '../lib/constants';
import { poemFormSchema } from '../model/schemas';
import type { UpdatePoemResult } from '../model/types';

/**
 * Server Action for updating an existing poem
 *
 * @param slug - Slug of the poem to update
 * @param formData - Form data containing updated poem information
 * @returns Promise with update result
 *
 * @example
 * ```typescript
 * const result = await updatePoem(slug, formData);
 * if (result.success) {
 *   console.log('Poem updated:', result.data);
 * }
 * ```
 */
export async function updatePoem(slug: string, formData: FormData): Promise<UpdatePoemResult> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      throw new Error(POEM_ERRORS.ACCESS_DENIED);
    }

    // 2. Authorization check - allow SUBSCRIBER, AUTHOR, MODERATOR, ADMIN
    if (!canCreateContent(session.user.role)) {
      throw new Error(POEM_ERRORS.INSUFFICIENT_PERMISSIONS);
    }

    // 3. Get existing poem by slug
    const existingPoem = await poemRepository.getBySlug(slug);
    if (!existingPoem) {
      throw new Error(POEM_ERRORS.POEM_NOT_FOUND);
    }

    // 4. Check ownership (only author can edit their own poems, except MODERATOR/ADMIN)
    if (existingPoem.authorId !== session.user.id && !canModerateContent(session.user.role)) {
      throw new Error(POEM_ERRORS.OWNERSHIP_REQUIRED);
    }

    // 5. Data parsing and validation
    const rawData = {
      title: formData.get(FORM_FIELDS.TITLE) as string,
      categoryId: formData.get(FORM_FIELDS.CATEGORY_ID) as string,
      content: JSON.parse(formData.get(FORM_FIELDS.CONTENT) as string),
    };

    const validatedData = poemFormSchema.parse(rawData);

    // 6. Content sanitization (basic XSS prevention)
    const sanitizedContent = validatedData.content.map(block => ({
      ...block,
      content: block.content.map(textBlock => ({
        ...textBlock,
        text: textBlock.text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
      })),
    }));

    // 7. Determine new status based on user role and current status
    let newStatus = existingPoem.status;
    if (existingPoem.status === ContentApprovalStatus.PENDING) {
      // If poem was pending, set status based on user role
      newStatus = getDefaultContentStatusForRole(session.user.role);
    }

    // 8. Update poem
    const updatedPoem = await poemRepository.update(existingPoem.id, {
      title: validatedData.title,
      content: sanitizedContent,
      categoryId: validatedData.categoryId,
      status: newStatus,
      publishedAt:
        newStatus === ContentApprovalStatus.APPROVED ? new Date() : existingPoem.publishedAt,
    });

    // 10. Cache revalidation
    revalidatePath(getRoutePath('POEM_DETAIL'));
    revalidatePath(getRoutePath('PROFILE'));
    revalidatePath(getRoutePath('DASHBOARD'));

    return {
      success: true,
      message:
        newStatus === ContentApprovalStatus.APPROVED
          ? POEM_SUCCESS.UPDATED_APPROVED
          : POEM_SUCCESS.UPDATED_PENDING,
      data: {
        id: updatedPoem.id,
        slug: updatedPoem.slug,
      },
    };
  } catch (error) {
    console.error(ErrorMessages.UPDATE_POEM_FAILED, error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: POEM_ERRORS.UNKNOWN_ERROR,
    };
  }
}
