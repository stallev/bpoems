'use server';

import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/entities/category';
import { poemRepository } from '@/entities/poem';
import { tagRepository } from '@/entities/tag';
import { auth } from '@/shared/api/auth';
import { POEM_ERRORS, POEM_SUCCESS } from '../model/constants';
import { poemFormSchema } from '../ui/PoemForm/model';

export async function updatePoem(poemId: string, formData: FormData) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      throw new Error(POEM_ERRORS.ACCESS_DENIED);
    }

    // 2. Authorization check - only authors can edit poems
    if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new Error(POEM_ERRORS.AUTHOR_ROLE_REQUIRED);
    }

    // 3. Get existing poem and check ownership
    const existingPoem = await poemRepository.findById(poemId);
    if (!existingPoem) {
      throw new Error(POEM_ERRORS.POEM_NOT_FOUND);
    }

    // Check ownership (authors can only edit their own poems, moderators/admins can edit any)
    if (session.user.role === 'AUTHOR' && existingPoem.authorId !== session.user.id) {
      throw new Error(POEM_ERRORS.NOT_AUTHORIZED);
    }

    // 4. Data parsing and validation
    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: (formData.get('description') as string) || undefined,
      content: JSON.parse(formData.get('content') as string),
      categoryId: (formData.get('categoryId') as string) || undefined,
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      isPublished: formData.get('isPublished') === 'true',
      language: formData.get('language') as 'EN' | 'RU' | 'UA',
    };

    const validatedData = poemFormSchema.parse(rawData);

    // 5. Check if slug is unique (excluding current poem)
    if (validatedData.slug !== existingPoem.slug) {
      const poemWithSameSlug = await poemRepository.findBySlug(validatedData.slug);
      if (poemWithSameSlug && poemWithSameSlug.id !== poemId) {
        throw new Error(POEM_ERRORS.SLUG_ALREADY_EXISTS);
      }
    }

    // 6. Validate category if provided
    if (validatedData.categoryId) {
      const category = await categoryRepository.findById(validatedData.categoryId);
      if (!category) {
        throw new Error(POEM_ERRORS.INVALID_CATEGORY);
      }
    }

    // 7. Process tags - create new ones if they don't exist
    const processedTags = await Promise.all(
      validatedData.tags.map(async (tagName: string) => {
        let tag = await tagRepository.findByName(tagName);
        if (!tag) {
          tag = await tagRepository.create({ name: tagName, nameId: tagName.toLowerCase() });
        }
        return tag;
      })
    );

    // 8. Determine if this is a new publication
    const isNewPublication = !existingPoem.publishedAt && validatedData.isPublished;

    // 9. Update poem with processed data
    const updateData = {
      title: validatedData.title,
      slug: validatedData.slug,
      description: validatedData.description,
      content: validatedData.content as any, // Cast to any for JSON compatibility
      publishedAt: validatedData.isPublished ? existingPoem.publishedAt || new Date() : null,
      category: validatedData.categoryId
        ? { connect: { id: validatedData.categoryId } }
        : { disconnect: true },
      tags: {
        disconnect: existingPoem.tags?.map((tag: any) => ({ tagId: tag.id })) || [],
        connect: processedTags.map((tag: any) => ({ tagId: tag.id })),
      },
    };

    const updatedPoem = await poemRepository.update(poemId, updateData);

    // 10. Cache revalidation
    revalidatePath('/profile');
    revalidatePath('/poems');
    revalidatePath(`/poems/${existingPoem.slug}`);
    revalidatePath(`/poems/${updatedPoem.slug}`);

    // 11. Success response
    let successMessage: string = POEM_SUCCESS.UPDATED;
    if (isNewPublication) {
      successMessage = POEM_SUCCESS.PUBLISHED;
    } else if (validatedData.isPublished && !existingPoem.publishedAt) {
      successMessage = POEM_SUCCESS.PUBLISHED;
    } else if (!validatedData.isPublished && existingPoem.publishedAt) {
      successMessage = POEM_SUCCESS.UNPUBLISHED;
    }

    return {
      success: true,
      message: successMessage,
      data: updatedPoem,
    };
  } catch (error) {
    console.error('Error updating poem:', error);

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
