import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/entities/user/model/types';
import { auth } from '@/shared/api/auth/auth';

/**
 * Middleware for protecting routes based on user authentication and role-based access control (RBAC).
 */
export async function middleware(req: NextRequest) {
  // Получаем сессию и токен через auth
  const session = await auth();

  // Проверяем наличие токена (аутентифицирован ли пользователь)
  const token = session?.user ? { role: session.user.role } : null;

  const pathname = req.nextUrl.pathname;

  // Защищенные маршруты, требующие авторизации
  if (pathname.startsWith('/profile')) {
    if (!token || token.role === 'READER') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  // Маршруты для создания и редактирования стихов (только для AUTHOR и выше)
  if (pathname.startsWith('/poems/create') || pathname.startsWith('/poems/edit')) {
    if (!token || !['AUTHOR', 'MODERATOR', 'ADMIN'].includes(token.role as UserRole)) {
      return NextResponse.redirect(new URL('/auth/error?error=Unauthorized', req.url));
    }
  }

  // Админские маршруты (только для MODERATOR и ADMIN)
  if (pathname.startsWith('/admin')) {
    if (!token || !['MODERATOR', 'ADMIN'].includes(token.role as UserRole)) {
      return NextResponse.redirect(new URL('/auth/error?error=Unauthorized', req.url));
    }
  }

  // Если маршрут защищен, но пользователь не аутентифицирован
  if (
    !token &&
    config.matcher.some(pattern => new RegExp(pattern.replace(':path*', '.*')).test(pathname))
  ) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Разрешаем доступ для всех остальных случаев
  return NextResponse.next();
}

/**
 * Configuration for middleware to specify protected routes.
 */
export const config = {
  matcher: ['/profile/:path*', '/poems/create', '/poems/edit/:path*', '/admin/:path*'],
};
