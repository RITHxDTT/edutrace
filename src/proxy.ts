import { NextResponse } from "next/server";
import { auth } from "./auth";
import { NextAuthRequest } from "next-auth";
import next from "next";

export default async function proxy(req : NextAuthRequest) {
  const session = await auth();
  const { nextUrl } = req;

  const isAuthenticated = !!session
  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register" || nextUrl.pathname === "/";

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isProtectedRoute = !isAuthPage;
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "//:path*", "/login", "/register"],
};