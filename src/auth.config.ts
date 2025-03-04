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
      const path = nextUrl.pathname;

      const protectedRoutes = ["/", "/sell", "/me"];
      const protectedRoutePrefixes = ["/event/"];

      const loginPage = "/login";

      const isOnProtectedRoute =
        protectedRoutes.includes(path) ||
        protectedRoutePrefixes.some((prefix) => path.startsWith(prefix));

      const isOnLoginPage = path.startsWith(loginPage);

      if (isLoggedIn) {
        if (isOnLoginPage) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      } else {
        if (isOnProtectedRoute) {
          return Response.redirect(new URL(loginPage, nextUrl));
        }
        return true;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username as string;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.username = profile.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
