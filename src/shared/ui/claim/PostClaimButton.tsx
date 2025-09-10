'use client';

import { Flag } from 'lucide-react';
import { ClaimResourceType } from '@/features/moderation/model/types';
import { useClaimReportStore } from '@/shared/lib/store/claimReportStore';
import { Button } from '../shadcnComponents/button';

// UI Constants for PostClaimButton component
const UI_CONSTANTS = {
  BUTTON_TITLE: 'Пожаловаться',
} as const;

interface PostClaimButtonProps {
  poemId?: string;
  isAuthor?: boolean;
}

/**
 * Component for claiming/reporting a poem
 */
export const PostClaimButton = ({ poemId, isAuthor = false }: PostClaimButtonProps) => {
  const { openModal } = useClaimReportStore();

  const handleClaim = () => {
    if (poemId) {
      openModal(poemId, ClaimResourceType.POEM);
    }
  };

  // Only show claim button if user is not the author and poemId is provided
  if (isAuthor || !poemId) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClaim}
      className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
      title={UI_CONSTANTS.BUTTON_TITLE}
    >
      <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>
  );
};
