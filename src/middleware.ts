import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "./lib/constants";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth/login", "/auth/projects"];

const protectedApi = ["/api/projects"];
const protectedMethods = ["POST", "PATCH", "DELETE"];

function isPathMatch(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || route.startsWith(`${route}/`),
  );
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get(SESSION_COOKIE);

    const isAuth = Boolean(sessionCookie);

    if (
      isPathMatch(pathname, protectedApi) &&
      protectedMethods.includes(request.method) &&
      !isAuth
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isPathMatch(pathname, protectedRoutes) && !isAuth) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);

      return NextResponse.redirect(loginUrl);
    }

    if (isPathMatch(pathname, authRoutes) && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error(`Middleware error: ${err}`);
    return NextResponse.json({ error: "Middleware Error" }, { status: 500 });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
