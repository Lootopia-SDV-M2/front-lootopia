import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes that require authentication
 */
const protectedRoutes = ["/profile", "/create", "/hunts", "/hunt"];

/**
 * Routes that should redirect to map if already authenticated
 */
const authRoutes = ["/login", "/register"];

/**
 * Middleware to handle route protection.
 * Checks for JWT token in cookies/localStorage simulation.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies (since localStorage is not available in middleware)
  const token = request.cookies.get("lootopia-auth-token")?.value;

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to map
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/map", request.url));
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (icons, images, etc.)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)",
  ],
};
