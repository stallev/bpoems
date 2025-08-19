'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { UserRole } from '@/shared/constants/Roles';
import { RoutePath } from '@/shared/constants/RoutePath';
import { MobileMenu } from './MobileMenu';
import { UserDropdownMenu } from './UserDropdownMenu';

const navItems = [
  { href: RoutePath.HOME.path, label: RoutePath.HOME.name },
  { href: RoutePath.POEMS_LIST.path, label: RoutePath.POEMS_LIST.name },
  { href: '/categories', label: 'Категории' },
  { href: '/tags', label: 'Теги' },
  { href: RoutePath.SEARCH.path, label: RoutePath.SEARCH.name },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role as UserRole;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href={RoutePath.HOME.path} className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">Christian Poetry</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? 'text-primary' : 'text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              href={RoutePath.LOGIN.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === RoutePath.LOGIN.path ? 'text-primary' : 'text-foreground'
              }`}
            >
              {RoutePath.LOGIN.name}
            </Link>
          )}
          {isAuthenticated && <UserDropdownMenu userRole={userRole} />}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-5">
          {isAuthenticated && <UserDropdownMenu userRole={userRole} />}
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            navItems={navItems}
            pathname={pathname}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </header>
  );
}
