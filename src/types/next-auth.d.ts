import NextAuth from "next-auth";

declare module "next-auth" {
  export interface Session {
    user: User & {
      username: string;
      isAdmin: boolean;
    };
  }
}
