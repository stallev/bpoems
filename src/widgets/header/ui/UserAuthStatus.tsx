'use client';

import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcnComponents/avatar';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcnComponents/dropdown-menu';

export function UserAuthStatus() {
  const { data: session, status } = useSession();
  console.log('session');

  if (status === 'loading') {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  if (status === 'authenticated' && session?.user) {
    const initials = session.user.name
      ? session.user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
      : 'U';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={session.user.image || ''}
                alt={session.user.name || 'Пользователь'}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/api/auth/signout">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-col md:flex-row">
      <Button asChild variant="ghost" size="sm">
        <Link href="/api/auth/signin">Войти</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/register">Регистрация</Link>
      </Button>
    </div>
  );
}
