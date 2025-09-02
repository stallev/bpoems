'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/shared/api/auth/auth';
import { prisma } from '@/shared/api/database/prisma';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { RoutePath } from '@/shared/constants/RoutePath';
import { UIConstants } from '../constants/ui';
import { ClaimReportSchema } from '../model/schemas';
import { ClaimResourceType } from '../model/types';

async function updateResourceStatus(resourceType: ClaimResourceType, resourceId: string) {
  switch (resourceType) {
    case ClaimResourceType.POEM:
      await prisma.poem.update({
        where: { id: resourceId },
        data: { status: 'PENDINGREVIEW' },
      });
      break;
    case ClaimResourceType.COMMENT:
      await prisma.comment.update({
        where: { id: resourceId },
        data: { status: 'PENDINGREVIEW' },
      });
      break;
    case ClaimResourceType.REVIEW:
      await prisma.review.update({
        where: { id: resourceId },
        data: { status: 'PENDINGREVIEW' },
      });
      break;
  }
}

export async function createClaimReport(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }

    const rawData = {
      resourceId: formData.get('resourceId') as string,
      resourceType: formData.get('resourceType') as ClaimResourceType,
      message: formData.get('message') as string,
    };

    const validatedData = ClaimReportSchema.parse(rawData);
    const isPrivilegedUser = ['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role);

    // Create data object based on resource type
    const claimData: {
      resourceType: ClaimResourceType;
      message: string;
      reporterId: string;
      poemId?: string;
      commentId?: string;
      reviewId?: string;
    } = {
      resourceType: validatedData.resourceType,
      message: validatedData.message,
      reporterId: session.user.id,
    };

    // Set the appropriate ID field based on resource type
    switch (validatedData.resourceType) {
      case ClaimResourceType.POEM:
        claimData.poemId = validatedData.resourceId;
        break;
      case ClaimResourceType.COMMENT:
        claimData.commentId = validatedData.resourceId;
        break;
      case ClaimResourceType.REVIEW:
        claimData.reviewId = validatedData.resourceId;
        break;
    }

    const claimReport = await prisma.claimReport.create({
      data: claimData,
    });

    if (isPrivilegedUser) {
      await updateResourceStatus(validatedData.resourceType, validatedData.resourceId);
    }

    revalidatePath(RoutePath.POEMS.path);
    revalidatePath(RoutePath.DASHBOARD.path);

    return {
      success: true,
      message: UIConstants.SUCCESS_MESSAGE,
      data: claimReport,
    };
  } catch (error) {
    console.error('Error creating claim report:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
