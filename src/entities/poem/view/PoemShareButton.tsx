import { Share2 } from 'lucide-react';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { POEMS_UI_CONSTANTS } from '../constants/PoemsConstants';

interface PoemShareButtonProps {
  setShowShareDialog: (show: boolean) => void;
}

const PoemShareButton = ({ setShowShareDialog }: PoemShareButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowShareDialog(true)}
      className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10"
      title={POEMS_UI_CONSTANTS.BUTTON_TITLES.SHARE}
    >
      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>
  );
};

export default PoemShareButton;
