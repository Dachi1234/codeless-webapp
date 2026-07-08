import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config shared by the middleware and the full Node auth.
 * Contains NO database or bcrypt access so it can run in the edge runtime.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/leads", nextUrl));
        return true;
      }

      // Everything else requires a session.
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
