'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { RoutePath } from '@/shared/constants/RoutePath';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/shadcnComponents/sheet';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navItems: Array<{ href: string; label: string }>;
  pathname: string;
  isAuthenticated: boolean;
}

export function MobileMenu({
  isOpen,
  setIsOpen,
  navItems,
  pathname,
  isAuthenticated,
}: MobileMenuProps) {
  const handleLogout = () => {
    setIsOpen(false);
    signOut({ callbackUrl: RoutePath.HOME.path });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="md:hidden px-8 md:max-w-sm">
        <SheetHeader>
          <span className="sr-only">
            <SheetTitle>Меню навигации</SheetTitle>
          </span>
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
              onClick={handleLogout}
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
  );
}
