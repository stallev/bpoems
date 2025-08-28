'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/shared/api/auth/auth';
import { prisma } from '@/shared/api/database/prisma';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';

export interface ModerationActivityData {
  activityType: string;
  description: string;
  targetUserId?: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export const moderationActivitySchema = {
  activityType: (value: string) => {
    if (!value || value.trim().length === 0) {
      throw new Error('Activity type is required');
    }
    return value.trim();
  },
  description: (value: string) => {
    if (!value || value.trim().length === 0) {
      throw new Error('Description is required');
    }
    if (value.trim().length > 1000) {
      throw new Error('Description must be less than 1000 characters');
    }
    return value.trim();
  },
  targetUserId: (value: string | undefined) => {
    if (value && value.trim().length === 0) {
      return undefined;
    }
    return value?.trim();
  },
  resourceType: (value: string | undefined) => {
    if (value && value.trim().length === 0) {
      return undefined;
    }
    return value?.trim();
  },
  resourceId: (value: string | undefined) => {
    if (value && value.trim().length === 0) {
      return undefined;
    }
    return value?.trim();
  },
  metadata: (value: Record<string, unknown> | undefined) => {
    return value || undefined;
  },
};

export async function logModerationActivity(data: ModerationActivityData) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }

    // 2. Authorization check - only moderators and admins can log activities
    if (!['MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new Error(ErrorMessages.MODERATOR_REQUIRED);
    }

    // 3. Data validation
    const validatedData = {
      activityType: moderationActivitySchema.activityType(data.activityType),
      description: moderationActivitySchema.description(data.description),
      targetUserId: moderationActivitySchema.targetUserId(data.targetUserId),
      resourceType: moderationActivitySchema.resourceType(data.resourceType),
      resourceId: moderationActivitySchema.resourceId(data.resourceId),
      metadata: moderationActivitySchema.metadata(data.metadata),
    };

    // 4. Create moderation activity
    const activity = await prisma.moderationActivity.create({
      data: {
        activityType: validatedData.activityType,
        description: validatedData.description,
        moderatorId: session.user.id,
        targetUserId: validatedData.targetUserId,
        resourceType: validatedData.resourceType,
        resourceId: validatedData.resourceId,
        metadata: data.metadata as any,
      },
    });

    // 5. Cache revalidation
    revalidatePath('/dashboard');

    // 6. Success response
    return {
      success: true,
      message: 'Moderation activity logged successfully',
      data: activity,
    };
  } catch (error) {
    console.error('Error logging moderation activity:', error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: ErrorMessages.UNKNOWN_ERROR,
    };
  }
}
