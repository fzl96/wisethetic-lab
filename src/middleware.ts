import NextAuth from "next-auth";
import authConfig from "@/auth.config";

import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  apiUploadthingPrefix,
  adminRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

// @ts-expect-error - `req`
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiUploadthingRoute =
    nextUrl.pathname.startsWith(apiUploadthingPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute || isApiUploadthingRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log(req.auth?.user);
      const redirectUrl =
        req.auth?.user.role === "ADMIN" ? "/dashboard" : DEFAULT_LOGIN_REDIRECT;
      return Response.redirect(new URL(redirectUrl, nextUrl));
    }
    return null;
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }
    if (req.auth?.user.role !== "ADMIN") {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
