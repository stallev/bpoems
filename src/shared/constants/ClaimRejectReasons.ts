/**
 * Claim rejection reasons for content moderation
 *
 * @module shared/constants/ClaimRejectReasons
 */

export type ClaimRejectReason = {
  reasonId: string;
  reasonName: { RU: string; EN: string };
};

/**
 * Available reasons for rejecting claim reports
 *
 * @example
 * ```typescript
 * import { ClaimRejectReasons } from '@/shared/constants/ClaimRejectReasons';
 *
 * const reason = ClaimRejectReasons.find(r => r.reasonId === 'INAPPROPRIATE_CONTENT');
 * console.log(reason?.reasonName.RU); // 'Неприемлемый контент'
 * ```
 */
export const ClaimRejectReasons: ClaimRejectReason[] = [
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
