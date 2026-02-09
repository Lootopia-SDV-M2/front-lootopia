import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/profile", "/create", "/hunts", "/hunt"];
const authRoutes = ["/login", "/register"];

function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("lootopia-auth-token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const role = getRoleFromToken(token);

    // Redirect authenticated users away from auth routes based on role
    if (isAuthRoute) {
      const dest = role === "ORGANISATEUR" ? "/create" : "/map";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    // Only ORGANISATEUR can access /create
    if (pathname.startsWith("/create") && role !== "ORGANISATEUR") {
      return NextResponse.redirect(new URL("/map", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)"],
};
