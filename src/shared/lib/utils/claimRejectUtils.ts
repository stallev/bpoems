import { ClaimRejectReasons, type ClaimRejectReason } from '@/shared/constants/ClaimRejectReasons';

/**
 * Get rejection reason by ID
 */
export const getRejectionReason = (reasonId: string): ClaimRejectReason | undefined => {
  return ClaimRejectReasons.find(reason => reason.reasonId === reasonId);
};

/**
 * Get all rejection reason IDs
 */
export const getRejectionReasonIds = (): string[] => {
  return ClaimRejectReasons.map(reason => reason.reasonId);
};
