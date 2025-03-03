import type { NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { toast } from "sonner";

export const authConfig = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnMainpage = nextUrl.pathname == "/";
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isLoggedIn) {
        if (isOnLogin) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      } else {
        if (isOnMainpage) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        return true;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
