'use client';

import { Edit, Trash2, Share2, Facebook, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { User } from '@/entities/user/model/types';
import { formatDate } from '@/shared/lib/utils/formatDate';
import { Avatar, AvatarFallback, AvatarImage } from './shadcnComponents/avatar';
import { Button } from './shadcnComponents/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './shadcnComponents/dialog';

interface AuthorInfoProps {
  author: User;
  createdAt: Date;
  className?: string;
  poemSlug?: string;
  isAuthor?: boolean;
  onDelete?: () => void;
}

/**
 * Component for displaying author information with avatar, profile link, and action buttons
 */
export const AuthorInfo = ({
  author,
  createdAt,
  className,
  poemSlug,
  isAuthor = false,
  onDelete,
}: AuthorInfoProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/poems/${poemSlug}`;
    const text = `Читайте стихотворение на нашей платформе`;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'vk':
        shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareDialog(false);
  };

  return (
    <>
      <div
        className={`w-fit flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg border shadow-sm ${
          className || ''
        }`}
      >
        <Link
          href={`/users/${author.id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src={author.image || undefined} alt={author.name || 'Author'} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm sm:text-base">
              {getInitials(author.name || 'Unknown')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground hover:text-primary transition-colors text-sm sm:text-base">
              {author.name}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {formatDate(createdAt)}
            </span>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-4">
          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShareDialog(true)}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10"
            title="Поделиться"
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          {/* Author Actions */}
          {isAuthor && (
            <>
              {/* Edit Button */}
              <Link href={`/profile/edit-poem/${poemSlug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10"
                  title="Редактировать"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                title="Удалить"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить стихотворение</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить это стихотворение? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поделиться стихотворением</DialogTitle>
            <DialogDescription>
              Выберите платформу для публикации ссылки на стихотворение
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare('vk')}
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
            >
              <MessageCircle className="h-4 w-4 text-blue-600" />
              VKontakte
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare('telegram')}
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
            >
              <Send className="h-4 w-4 text-blue-600" />
              Telegram
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
