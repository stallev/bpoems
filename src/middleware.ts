// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { RoutePath } from '@/shared/constants/RoutePath';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for protected routes
  if (['/dashboard', '/profile'].some(path => pathname.startsWith(path))) {
    // Get token from cookies without using auth() function
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL(RoutePath.LOGIN.path, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
