import NextAuth from "next-auth";

module "next-auth" {
  interface Session {
    user: User & {
      username: string;
    };
  }
}
