import type { NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

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
      const isAdmin = auth?.user.isAdmin;

      const protectedRoutes = ["/", "/sell", "/me", "/admin"];
      const protectedRoutePrefixes = ["/event/"];

      const loginPage = "/login";
      const isOnAdminRoute = path.startsWith("/admin");

      const isOnProtectedRoute =
        protectedRoutes.includes(path) ||
        protectedRoutePrefixes.some((prefix) => path.startsWith(prefix));

      const isOnLoginPage = path.startsWith(loginPage);

      const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
      const isOnMaintenancePage = path.startsWith("/maintenance");

      const isAllowedDuringMaintenance =
        isOnMaintenancePage ||
        path.startsWith("/api") ||
        path.startsWith("/_next") ||
        path.startsWith("/static") ||
        path.endsWith(".js") ||
        path.endsWith(".css") ||
        path.endsWith(".ico") ||
        path.endsWith(".png") ||
        path.endsWith(".jpg") ||
        path.endsWith(".svg");

      if (isMaintenanceMode && !isAllowedDuringMaintenance) {
        return Response.redirect(new URL("/maintenance", nextUrl));
      }

      if (!isMaintenanceMode && isOnMaintenancePage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isLoggedIn) {
        if (isOnLoginPage) {
          return Response.redirect(new URL("/", nextUrl));
        } else if (isOnAdminRoute && !isAdmin) {
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
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.username = profile.username;

        const adminNicknames = ["viktrix8", "ovosk", "kristian2525"];
        token.isAdmin = adminNicknames.includes(token.username as string);
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
