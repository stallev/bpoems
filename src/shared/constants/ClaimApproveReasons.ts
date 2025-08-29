/**
 * Claim approval reasons for content moderation
 *
 * @module shared/constants/ClaimApproveReasons
 */

export type ClaimApproveReason = {
  reasonId: string;
  reasonName: { RU: string; EN: string };
};

/**
 * Available reasons for approving claim reports
 *
 * @example
 * ```typescript
 * import { ClaimApproveReasons } from '@/shared/constants/ClaimApproveReasons';
 *
 * const reason = ClaimApproveReasons.find(r => r.reasonId === 'INAPPROPRIATE_CONTENT');
 * console.log(reason?.reasonName.RU); // 'Неприемлемый контент'
 * ```
 */
export const ClaimApproveReasons: ClaimApproveReason[] = [
  {
    reasonId: 'INAPPROPRIATE_CONTENT',
    reasonName: {
      RU: 'Неприемлемый контент',
      EN: 'Inappropriate content',
    },
  },
  {
    reasonId: 'COPYRIGHT_VIOLATION',
    reasonName: {
      RU: 'Нарушение авторских прав',
      EN: 'Copyright violation',
    },
  },
  {
    reasonId: 'SPAM',
    reasonName: {
      RU: 'Спам',
      EN: 'Spam',
    },
  },
  {
    reasonId: 'OFFENSIVE_LANGUAGE',
    reasonName: {
      RU: 'Оскорбительный язык',
      EN: 'Offensive language',
    },
  },
  {
    reasonId: 'MISLEADING_INFORMATION',
    reasonName: {
      RU: 'Вводящая в заблуждение информация',
      EN: 'Misleading information',
    },
  },
  {
    reasonId: 'VIOLENCE_OR_HARM',
    reasonName: {
      RU: 'Насилие или причинение вреда',
      EN: 'Violence or harm',
    },
  },
] as const;
