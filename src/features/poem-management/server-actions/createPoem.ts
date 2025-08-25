'use server';

import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/entities/category';
import { poemRepository } from '@/entities/poem';
import { tagRepository } from '@/entities/tag';
import { auth } from '@/shared/api/auth';
import { POEM_ERRORS, POEM_SUCCESS } from '../model/constants';
import { poemFormSchema } from '../ui/PoemForm/model';

export async function createPoem(formData: FormData) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      throw new Error(POEM_ERRORS.ACCESS_DENIED);
    }

    // 2. Authorization check - only authors can create poems
    if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new Error(POEM_ERRORS.AUTHOR_ROLE_REQUIRED);
    }

    // 3. Data parsing and validation
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

    // 4. Check if slug is unique
    const existingPoem = await poemRepository.findBySlug(validatedData.slug);
    if (existingPoem) {
      throw new Error(POEM_ERRORS.SLUG_ALREADY_EXISTS);
    }

    // 5. Validate category if provided
    if (validatedData.categoryId) {
      const category = await categoryRepository.findById(validatedData.categoryId);
      if (!category) {
        throw new Error(POEM_ERRORS.INVALID_CATEGORY);
      }
    }

    // 6. Process tags - create new ones if they don't exist
    const processedTags = await Promise.all(
      validatedData.tags.map(async (tagName: string) => {
        let tag = await tagRepository.findByName(tagName);
        if (!tag) {
          tag = await tagRepository.create({ name: tagName, nameId: tagName.toLowerCase() });
        }
        return tag;
      })
    );

    // 7. Create poem with processed data
    const poemData = {
      title: validatedData.title,
      slug: validatedData.slug,
      description: validatedData.description,
      content: validatedData.content as any, // Cast to any for JSON compatibility
      authorId: session.user.id,
      status: 'APPROVED' as const, // Authors can publish immediately
      publishedAt: validatedData.isPublished ? new Date() : null,
      category: validatedData.categoryId
        ? { connect: { id: validatedData.categoryId } }
        : undefined,
      tags: {
        connect: processedTags.map((tag: any) => ({ tagId: tag.id })),
      },
    };

    const poem = await poemRepository.create(poemData);

    // 8. Cache revalidation
    revalidatePath('/profile');
    revalidatePath('/poems');
    revalidatePath(`/poems/${poem.slug}`);

    // 9. Success response
    return {
      success: true,
      message: validatedData.isPublished ? POEM_SUCCESS.PUBLISHED : POEM_SUCCESS.DRAFT_SAVED,
      data: poem,
    };
  } catch (error) {
    console.error('Error creating poem:', error);

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
