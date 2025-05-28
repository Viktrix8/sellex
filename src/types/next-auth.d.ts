// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      username: string;
      isAdmin: boolean;
      isMember: boolean;
      isGuest: boolean;
    };
  }

  interface User extends DefaultUser {
    username: string;
    isAdmin: boolean;
    isMember: boolean;
    isGuest: boolean;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    username: string;
    isAdmin: boolean;
    isMember: boolean;
    isGuest: boolean;
  }
}
