import { Facebook, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcnComponents/dialog';
import { POEMS_UI_CONSTANTS } from '../constants/PoemsConstants';

interface PoemShareDialogModalProps {
  showShareDialog: boolean;
  setShowShareDialog: (show: boolean) => void;
  poemSlug: string;
}

const PoemShareDialogModal = ({
  showShareDialog,
  setShowShareDialog,
  poemSlug,
}: PoemShareDialogModalProps) => {
  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/poems/${poemSlug}`;
    const text = POEMS_UI_CONSTANTS.SHARE_TEXT;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };

    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareDialog(false);
  };

  const renderSharePlatformButton = (platform: string, icon: React.ReactNode, color: string) => (
    <Button
      variant="outline"
      onClick={() => handleShare(platform)}
      className={`flex items-center gap-2 h-12 hover:${color} transition-colors`}
    >
      {icon}
      <span className="font-medium">
        {
          POEMS_UI_CONSTANTS.PLATFORMS[
            platform.toUpperCase() as keyof typeof POEMS_UI_CONSTANTS.PLATFORMS
          ]
        }
      </span>
    </Button>
  );

  return (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogContent className="min-w-[280px] sm:min-w-[420px] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {POEMS_UI_CONSTANTS.SHARE_DIALOG_TITLE}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {POEMS_UI_CONSTANTS.SHARE_DIALOG_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {renderSharePlatformButton(
            'facebook',
            <Facebook className="h-5 w-5 text-blue-600" />,
            'bg-blue-50 hover:text-blue-600 hover:border-blue-200'
          )}
          {renderSharePlatformButton(
            'vk',
            <MessageCircle className="h-5 w-5 text-blue-600" />,
            'bg-blue-50 hover:text-blue-600 hover:border-blue-200'
          )}
          {renderSharePlatformButton(
            'whatsapp',
            <MessageCircle className="h-5 w-5 text-green-600" />,
            'bg-green-50 hover:text-green-600 hover:border-green-200'
          )}
          {renderSharePlatformButton(
            'telegram',
            <Send className="h-5 w-5 text-blue-600" />,
            'bg-blue-50 hover:text-blue-600 hover:border-blue-200'
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PoemShareDialogModal;
