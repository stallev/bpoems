'use client';

import { Book, LogOut, Pencil, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { UserRole } from '@/shared/constants/Roles';
import { RoutePath } from '@/shared/constants/RoutePath';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcnComponents/avatar';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcnComponents/dropdown-menu';

interface UserDropdownMenuProps {
  userRole?: UserRole;
}

function getInitials(name: string | null): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserDropdownMenu({ userRole }: UserDropdownMenuProps) {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: RoutePath.HOME.path });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={session?.user?.image || ''}
              alt={session?.user?.name ?? 'Пользователь'}
            />
            <AvatarFallback>{getInitials(session?.user?.name ?? null)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={RoutePath.PROFILE.path}>
            <User className="mr-2 h-4 w-4" />
            <span>Профиль</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={RoutePath.PROFILE_SETTINGS.path}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Настройки</span>
          </Link>
        </DropdownMenuItem>

        {userRole === UserRole.AUTHOR ||
        userRole === UserRole.MODERATOR ||
        userRole === UserRole.ADMIN ? (
          <div className="my-2 flex flex-col gap-4">
            <DropdownMenuItem asChild>
              <Link href={`${RoutePath.POEMS_LIST.path}?author=${session?.user?.name || 'user'}`}>
                <Book className="mr-2 h-4 w-4" />
                <span>Мои стихи</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={RoutePath.POEM_CREATE.path}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Создать стих</span>
              </Link>
            </DropdownMenuItem>
          </div>
        ) : null}
        {userRole === UserRole.ADMIN ? (
          <DropdownMenuItem asChild>
            <Link href={RoutePath.DASHBOARD.path}>{RoutePath.DASHBOARD.name}</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
