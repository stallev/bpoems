# Middleware Edge Runtime Fix Documentation

## Problem Description

When adding middleware to the project, the build fails with the following error:

```
A Node.js API is used (process.nextTick at line: 181) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime

Import trace for requested module:
./node_modules/bcrypt/bcrypt.js
./src/shared/api/auth/auth.ts
```

## Root Cause

### Edge Runtime Limitations
- **Middleware in Next.js** runs in Edge Runtime by default
- **Edge Runtime** is a lightweight JavaScript runtime that doesn't support Node.js APIs
- **bcrypt library** uses Node.js APIs (`process.nextTick`) which are not available in Edge Runtime

### Problem Chain
1. Middleware imports `auth()` from `@/shared/api/auth/auth`
2. `auth()` function imports `bcrypt` for password hashing
3. `bcrypt` uses Node.js APIs not supported in Edge Runtime
4. Build fails when trying to bundle middleware

## Solution

### Approach: Use JWT Token Verification
Instead of using the full `auth()` function, use `getToken()` from `next-auth/jwt` which is Edge Runtime compatible.

### Implementation

#### Before (Problematic Code)
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/shared/api/auth/auth'; // ❌ Imports bcrypt

export async function middleware(request: NextRequest) {
  const session = await auth(); // ❌ Uses Node.js APIs
  const { pathname } = request.nextUrl;

  if (['/dashboard', '/profile'].some(path => pathname.startsWith(path)) && !session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

#### After (Fixed Code)
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // ✅ Edge Runtime compatible

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
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
```

## Key Changes

### 1. Import Change
- **Removed**: `import { auth } from '@/shared/api/auth/auth'`
- **Added**: `import { getToken } from 'next-auth/jwt'`

### 2. Authentication Method
- **Removed**: `const session = await auth()`
- **Added**: `const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })`

### 3. Token Verification
- **Before**: Check `session?.user`
- **After**: Check `token` existence

### 4. Redirect URL
- **Before**: `/login`
- **After**: `/auth` (matches the actual auth page route)

## Benefits

### 1. Edge Runtime Compatibility
- ✅ No Node.js API dependencies
- ✅ Works in Edge Runtime
- ✅ Faster execution

### 2. Performance
- ✅ Lighter weight than full auth() function
- ✅ No database queries in middleware
- ✅ JWT verification only

### 3. Security
- ✅ Still validates JWT tokens
- ✅ Uses same secret as auth configuration
- ✅ Maintains security standards

## Alternative Solutions

### Option 1: Disable Edge Runtime (Not Recommended)
```typescript
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
  runtime: 'nodejs', // ❌ Forces Node.js runtime
};
```

**Problems:**
- Slower execution
- Higher memory usage
- Not recommended for production

### Option 2: Move Authentication to API Routes
```typescript
// middleware.ts - Only check for token existence
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  
  if (['/dashboard', '/profile'].some(path => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return NextResponse.next();
}
```

**Problems:**
- Less secure (no JWT validation)
- No token expiration checking
- Manual cookie handling

## Best Practices

### 1. Keep Middleware Lightweight
- ✅ Use JWT verification only
- ✅ Avoid database queries
- ✅ Avoid heavy computations

### 2. Use Appropriate Runtime
- ✅ Edge Runtime for simple operations
- ✅ Node.js Runtime for complex operations

### 3. Environment Variables
- ✅ Ensure `AUTH_SECRET` is properly set
- ✅ Use same secret as auth configuration

### 4. Error Handling
```typescript
export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (['/dashboard', '/profile'].some(path => pathname.startsWith(path))) {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
      });

      if (!token) {
        return NextResponse.redirect(new URL('/auth', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Log error and redirect to auth page
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}
```

## Testing

### 1. Build Test
```bash
npm run build
# Should complete without Edge Runtime errors
```

### 2. Runtime Test
```bash
npm run dev
# Test protected routes:
# - /dashboard (should redirect to /auth if not authenticated)
# - /profile (should redirect to /auth if not authenticated)
```

### 3. Authentication Test
- Login with valid credentials
- Access protected routes
- Verify middleware allows access
- Logout and verify redirect

## Related Documentation

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Edge Runtime Limitations](https://nextjs.org/docs/api-reference/edge-runtime)
- [NextAuth.js JWT Documentation](https://next-auth.js.org/configuration/options#jwt)
- [Auth.js Edge Runtime Guide](https://authjs.dev/reference/nextjs#edge-runtime)

## Migration Notes

### For Existing Projects
1. Update middleware implementation
2. Test all protected routes
3. Verify authentication flow
4. Update documentation

### For New Projects
1. Use JWT-based middleware from start
2. Avoid importing auth() in middleware
3. Keep middleware lightweight
4. Test Edge Runtime compatibility early
