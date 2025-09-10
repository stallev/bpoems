'use client';

import { useState } from 'react';
import PoemShareButton from '@/entities/poem/view/PoemShareButton';
import PoemShareDialogModal from '@/entities/poem/view/PoemShareDialogModal';
import { useDeletePoem } from '@/features/poem/lib/hooks/useDeletePoem';
import AuthorButtons from '@/shared/ui/author/AuthorButtons';
import DeleteConfirmationDialog from '@/shared/ui/modals/DeleteConfirmationDialog';

interface PoemsHeaderButtonsProps {
  poemSlug: string;
  poemId: string;
  isAuthor?: boolean;
}

export const PoemsHeaderButtons = ({
  poemSlug,
  poemId,
  isAuthor = false,
}: PoemsHeaderButtonsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { deletePoem } = useDeletePoem();

  const handleDelete = async () => {
    setShowDeleteDialog(false);

    if (!isAuthor) return;
    await deletePoem(poemId);
  };

  return (
    <>
      <PoemShareButton setShowShareDialog={setShowShareDialog} />
      {isAuthor && <AuthorButtons poemSlug={poemSlug} setShowDeleteDialog={setShowDeleteDialog} />}

      <DeleteConfirmationDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleDelete={handleDelete}
      />

      <PoemShareDialogModal
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        poemSlug={poemSlug}
      />
    </>
  );
};
