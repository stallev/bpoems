import {
  ClaimApproveReasons,
  type ClaimApproveReason,
} from '@/shared/constants/ClaimApproveReasons';

/**
 * Get approval reason by ID
 */
export const getApprovalReason = (reasonId: string): ClaimApproveReason | undefined => {
  return ClaimApproveReasons.find(reason => reason.reasonId === reasonId);
};

/**
 * Get all approval reason IDs
 */
export const getApprovalReasonIds = (): string[] => {
  return ClaimApproveReasons.map(reason => reason.reasonId);
};
