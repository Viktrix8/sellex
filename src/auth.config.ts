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

      const protectedRoutes = ["/", "/sell"];
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
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
