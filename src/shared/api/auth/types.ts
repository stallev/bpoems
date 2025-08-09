// src/shared/api/auth/types.ts

// Extend NextAuth types to include role field
// Augment the User type to include role
declare module 'next-auth' {
  interface User {
    id: string;
    role?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }

  interface JWT {
    id: string;
    role: string;
  }
}

// Export custom types for use in the application
export type SessionFallback = {
  id: string;
};
