import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const url = request.nextUrl;
  if (
    !token &&
    (url.pathname == "/settings" ||
      url.pathname == "/about" ||
      url.pathname == "/dashboard" ||
      url.pathname == "/invite-users" ||
      url.pathname == "/profile" ||
      url.pathname == "/pricing")
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && (url.pathname === "/sign-in" || url.pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/settings",
    "/about",
    "/invite-users",
    "/pricing",
    "/profile",
  ],
};
