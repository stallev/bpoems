'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/shadcnComponents/sheet';
// import { UserAuthStatus } from './UserAuthStatus';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Стихи', href: '/poems' },
  { label: 'Категории', href: '/categories' },
  { label: 'О нас', href: '/about' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-section py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-10 h-10" />
          </Link>

          <nav className="hidden md:flex gap-6">
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
              </nav>

              {/* <UserAuthStatus /> */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
