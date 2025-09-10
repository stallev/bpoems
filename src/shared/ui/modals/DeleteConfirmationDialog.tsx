import { POEMS_UI_CONSTANTS } from '@/entities/poem/constants/PoemsConstants';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcnComponents/dialog';

interface DeleteConfirmationDialogProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  handleDelete: () => void;
}

const DeleteConfirmationDialog = ({
  showDeleteDialog,
  setShowDeleteDialog,
  handleDelete,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="min-w-[280px] sm:min-w-[420px] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{POEMS_UI_CONSTANTS.DELETE_DIALOG_TITLE}</DialogTitle>
          <DialogDescription>{POEMS_UI_CONSTANTS.DELETE_DIALOG_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
            {POEMS_UI_CONSTANTS.CANCEL_BUTTON}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {POEMS_UI_CONSTANTS.DELETE_BUTTON}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
