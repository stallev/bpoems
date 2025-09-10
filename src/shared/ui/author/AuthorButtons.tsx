'use client';

import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { POEMS_UI_CONSTANTS } from '@/entities/poem/constants/PoemsConstants';
import { Button } from '@/shared/ui/shadcnComponents/button';

interface AuthorButtonsProps {
  poemSlug: string;
  setShowDeleteDialog: (show: boolean) => void;
}

const AuthorButtons = ({ poemSlug, setShowDeleteDialog }: AuthorButtonsProps) => {
  return (
    <>
      <Link href={`/profile/edit-poem/${poemSlug}`}>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10"
          title={POEMS_UI_CONSTANTS.BUTTON_TITLES.EDIT}
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        title={POEMS_UI_CONSTANTS.BUTTON_TITLES.DELETE}
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </>
  );
};

export default AuthorButtons;
