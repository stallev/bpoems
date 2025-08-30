'use server';

import { revalidatePath } from 'next/cache';
import { poemRepository } from '@/entities/poem';
import { auth } from '@/shared/api/auth/auth';
import { prisma } from '@/shared/api/database/prisma';
import { ContentApprovalStatus } from '@/shared/constants/ContentStatus';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { getDefaultContentStatusForRole } from '@/shared/lib/utils/contentStatusUtils';
import { canCreateContent } from '@/shared/lib/utils/roleUtils';
import { getRoutePath } from '@/shared/lib/utils/routeUtils';
import { ensureUniqueSlug } from '@/shared/lib/utils/slugify';
import { POEM_ERRORS, POEM_SUCCESS, FORM_FIELDS } from '../lib/constants';
import { poemFormSchema } from '../model/schemas';
import type { CreatePoemResult } from '../model/types';

/**
 * Server Action for creating a new poem
 *
 * @param formData - Form data containing poem information
 * @returns Promise with creation result
 *
 * @example
 * ```typescript
 * const result = await createPoem(formData);
 * if (result.success) {
 *   console.log('Poem created:', result.data);
 * }
 * ```
 */
export async function createPoem(formData: FormData): Promise<CreatePoemResult> {
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

    // 3. Data parsing and validation
    const rawData = {
      title: formData.get(FORM_FIELDS.TITLE) as string,
      categoryId: formData.get(FORM_FIELDS.CATEGORY_ID) as string,
      content: JSON.parse(formData.get(FORM_FIELDS.CONTENT) as string),
    };

    const validatedData = poemFormSchema.parse(rawData);

    // 4. Content sanitization (basic XSS prevention)
    const sanitizedContent = validatedData.content.map(block => ({
      ...block,
      content: block.content.map(textBlock => ({
        ...textBlock,
        text: textBlock.text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
      })),
    }));

    // 5. Generate unique slug from title
    const slug = await ensureUniqueSlug(validatedData.title, prisma);

    // 6. Set approval status based on user role
    const status = getDefaultContentStatusForRole(session.user.role);

    // 7. Create poem
    const poem = await poemRepository.create({
      title: validatedData.title,
      slug,
      content: sanitizedContent,
      authorId: session.user.id,
      categoryId: validatedData.categoryId,
      status,
      publishedAt: status === ContentApprovalStatus.APPROVED ? new Date() : null,
    });

    // 8. Cache revalidation
    revalidatePath(getRoutePath('POEM_DETAIL'));
    revalidatePath(getRoutePath('PROFILE'));
    revalidatePath(getRoutePath('DASHBOARD'));

    return {
      success: true,
      message:
        status === ContentApprovalStatus.APPROVED
          ? POEM_SUCCESS.CREATED_APPROVED
          : POEM_SUCCESS.CREATED_PENDING,
      data: {
        id: poem.id,
        slug: poem.slug,
      },
    };
  } catch (error) {
    console.error(ErrorMessages.CREATE_POEM_FAILED, error);

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
