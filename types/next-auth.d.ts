// types/next-auth.d.ts (or next-auth.d.ts in your root)
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      image?: string;
      name: string;
      role: 'user' | 'admin';
      createdAt: string;
    }
  }

  interface User {
    id: string;
    email: string;
    image?: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    image?: string;
    role: 'user' | 'admin';
    createdAt: string;
  }
}