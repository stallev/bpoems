'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/shared/api/auth/auth';
import { prisma } from '@/shared/api/database/prisma';
import { ClaimRejectReasons } from '@/shared/constants/ClaimRejectReasons';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { RoutePath } from '@/shared/constants/RoutePath';
import { logModerationActivity } from './logModerationActivity';

/**
 * Schema for claim report handling validation
 */
const claimReportSchema = z
  .object({
    claimId: z.string(),
    claimResultDecision: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'PENDINGREVIEW']),
    claim_reject_decision_reason: z
      .string()
      .optional()
      .refine(value => !value || ClaimRejectReasons.some(reason => reason.reasonId === value), {
        message: ErrorMessages.INVALID_REJECTION_REASON,
      }),
  })
  .refine(data => data.claimResultDecision !== 'REJECTED' || !!data.claim_reject_decision_reason, {
    message: ErrorMessages.REJECTION_REASON_REQUIRED,
    path: ['claim_reject_decision_reason'],
  });

/**
 * Server Action for handling claim reports by moderators and admins
 *
 * @param formData - Form data containing claim handling information
 * @returns Promise with handling result
 *
 * @example
 * ```typescript
 * const result = await handleClaimReport(formData);
 * if (result.success) {
 *   console.log('Claim processed:', result.data);
 * }
 * ```
 */
export async function handleClaimReport(formData: FormData) {
  const session = await auth();
  if (!session?.user || !['MODERATOR', 'ADMIN'].includes(session.user.role)) {
    return { success: false, message: ErrorMessages.UNAUTHORIZED };
  }

  try {
    const data = claimReportSchema.parse({
      claimId: formData.get('claimId'),
      claimResultDecision: formData.get('claimResultDecision'),
      claim_reject_decision_reason: formData.get('claim_reject_decision_reason'),
    });

    // Get the claim report to check if it exists
    const existingClaim = await prisma.claimReport.findUnique({
      where: { id: data.claimId },
      include: {
        poem: true,
        comment: true,
        review: true,
      },
    });

    if (!existingClaim) {
      return { success: false, message: ErrorMessages.CLAIM_NOT_FOUND };
    }

    // Update the claim report
    const claimReport = await prisma.claimReport.update({
      where: { id: data.claimId },
      data: {
        claimResultDecision: data.claimResultDecision,
        // claim_reject_decision_reason: data.claim_reject_decision_reason, // TODO: Uncomment after schema update
        handlerId: session.user.id,
        claimResultDecisionAt: new Date(),
      },
    });

    // Update the related content status if claim is approved
    if (data.claimResultDecision === 'APPROVED') {
      if (existingClaim.poem) {
        await prisma.poem.update({
          where: { id: existingClaim.poem.id },
          data: { status: 'REJECTED' },
        });
      } else if (existingClaim.comment) {
        await prisma.comment.update({
          where: { id: existingClaim.comment.id },
          data: { status: 'REJECTED' },
        });
      } else if (existingClaim.review) {
        await prisma.review.update({
          where: { id: existingClaim.review.id },
          data: { status: 'REJECTED' },
        });
      }
    }

    // Log moderation activity
    await logModerationActivity({
      actionType: data.claimResultDecision === 'REJECTED' ? 'CLAIM_REJECT' : 'CLAIM_APPROVE',
      claimReportId: claimReport.id,
      reason: data.claim_reject_decision_reason,
    });

    // Revalidate relevant paths
    revalidatePath(RoutePath.POEMS.path);
    revalidatePath(RoutePath.DASHBOARD.path);
    revalidatePath(RoutePath.CLAIM_REPORTS.path);

    return {
      success: true,
      message: `Claim ${data.claimResultDecision.toLowerCase()} successfully`,
      data: claimReport,
    };
  } catch (error) {
    console.error(ErrorMessages.HANDLE_CLAIM_REPORT_FAILED, error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: (error as any).errors[0]?.message || ErrorMessages.VALIDATION_ERROR,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: ErrorMessages.HANDLE_CLAIM_REPORT_FAILED,
    };
  }
}
