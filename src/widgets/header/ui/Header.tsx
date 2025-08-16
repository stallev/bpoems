'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Menu, User, Settings, Book, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/shadcnComponents/sheet';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: RoutePath.HOME.name, href: RoutePath.HOME.path },
  { label: RoutePath.POEMS_LIST.name, href: RoutePath.POEMS_LIST.path },
  { label: RoutePath.PROFILE.name, href: RoutePath.PROFILE.path },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const userRole = session?.user?.role || UserRole.SUBSCRIBER;
  console.log('session', session);

  const handleLogout = async () => {
    await signOut({ callbackUrl: RoutePath.HOME.path });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-section py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-10 h-10" />
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link
                href={RoutePath.LOGIN.path}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {RoutePath.LOGIN.name}
              </Link>
            )}

            {isAuthenticated && (
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
                    <Link
                      href={`${RoutePath.PROFILE.path.replace('[username]', session?.user?.name || 'user')}`}
                    >
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
                    <DropdownMenuItem asChild>
                      <Link
                        href={`${RoutePath.POEMS_LIST.path}?author=${session?.user?.name || 'user'}`}
                      >
                        <Book className="mr-2 h-4 w-4" />
                        <span>Мои стихи</span>
                      </Link>
                    </DropdownMenuItem>
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
            )}
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:hidden px-8 md:max-w-sm">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Меню навигации</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              <nav className="flex flex-col">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm border-b border-b-foreground/10 pb-2 pt-4 font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: RoutePath.HOME.path });
                    }}
                    className="mt-4 text-sm font-medium text-foreground/60 hover:text-primary"
                  >
                    Выйти
                  </Button>
                ) : (
                  <Link
                    href={RoutePath.LOGIN.path}
                    onClick={() => setIsOpen(false)}
                    className={`mt-4 text-sm border-b border-b-foreground/10 pb-2 pt-4 font-medium transition-colors hover:text-primary ${
                      pathname === RoutePath.LOGIN.path ? 'text-foreground' : 'text-foreground/60'
                    }`}
                  >
                    {RoutePath.LOGIN.name}
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
