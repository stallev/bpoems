'use client';

import { Edit, Trash2, Share2, Facebook, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './shadcnComponents/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './shadcnComponents/dialog';

// UI Constants for PoemsHeaderButtons component
const UI_CONSTANTS = {
  SHARE_DIALOG_TITLE: 'Поделиться стихотворением',
  SHARE_DIALOG_DESCRIPTION: 'Выберите платформу для публикации ссылки на стихотворение',
  DELETE_DIALOG_TITLE: 'Удалить стихотворение',
  DELETE_DIALOG_DESCRIPTION:
    'Вы уверены, что хотите удалить это стихотворение? Это действие нельзя отменить.',
  CANCEL_BUTTON: 'Отмена',
  DELETE_BUTTON: 'Удалить',
  SHARE_TEXT: 'Читайте стихотворение на нашей платформе',
  BUTTON_TITLES: {
    SHARE: 'Поделиться',
    EDIT: 'Редактировать',
    DELETE: 'Удалить',
  },
  PLATFORMS: {
    FACEBOOK: 'Facebook',
    VKONTAKTE: 'VKontakte',
    WHATSAPP: 'WhatsApp',
    TELEGRAM: 'Telegram',
  },
} as const;

interface PoemsHeaderButtonsProps {
  poemSlug?: string;
  isAuthor?: boolean;
  onDelete?: () => void;
}

/**
 * Component for poem action buttons (share, edit, delete)
 */
export const PoemsHeaderButtons = ({
  poemSlug,
  isAuthor = false,
  onDelete,
}: PoemsHeaderButtonsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/poems/${poemSlug}`;
    const text = UI_CONSTANTS.SHARE_TEXT;

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

  const renderShareButton = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowShareDialog(true)}
      className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10"
      title={UI_CONSTANTS.BUTTON_TITLES.SHARE}
    >
      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>
  );

  const renderAuthorButtons = () => {
    if (!isAuthor) return null;

    return (
      <>
        <Link href={`/profile/edit-poem/${poemSlug}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10"
            title={UI_CONSTANTS.BUTTON_TITLES.EDIT}
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          title={UI_CONSTANTS.BUTTON_TITLES.DELETE}
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </>
    );
  };

  const renderSharePlatformButton = (platform: string, icon: React.ReactNode, color: string) => (
    <Button
      variant="outline"
      onClick={() => handleShare(platform)}
      className={`flex items-center gap-2 h-12 hover:${color} transition-colors`}
    >
      {icon}
      <span className="font-medium">
        {UI_CONSTANTS.PLATFORMS[platform.toUpperCase() as keyof typeof UI_CONSTANTS.PLATFORMS]}
      </span>
    </Button>
  );

  return (
    <>
      {renderShareButton()}
      {renderAuthorButtons()}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="min-w-[280px] sm:min-w-[420px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{UI_CONSTANTS.DELETE_DIALOG_TITLE}</DialogTitle>
            <DialogDescription>{UI_CONSTANTS.DELETE_DIALOG_DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {UI_CONSTANTS.CANCEL_BUTTON}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {UI_CONSTANTS.DELETE_BUTTON}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="min-w-[280px] sm:min-w-[420px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {UI_CONSTANTS.SHARE_DIALOG_TITLE}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {UI_CONSTANTS.SHARE_DIALOG_DESCRIPTION}
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
    </>
  );
};
