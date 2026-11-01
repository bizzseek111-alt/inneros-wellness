import { NextRequest, NextResponse } from "next/server";

const PUBLIC_MARKETING_ROUTES = new Set([
  "/",
  "/features",
  "/how-it-works",
  "/about",
  "/privacy-trust",
  "/pricing",
  "/faq",
  "/contact",
  "/safety",
  "/explore",
  "/design-system",
]);

const AUTH_ROUTES = new Set(["/login", "/signup", "/onboarding"]);

/**
 * InnerOS Next.js Edge Middleware
 * - Classifies route tier (public_marketing, auth, admin_console, sanctuary_app)
 * - Enforces session cookie presence on protected routes when NEXT_PUBLIC_ENFORCE_STRICT_AUTH === "true"
 * - Applies defense-in-depth HTTP security headers across all web responses
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isPublicRoute = PUBLIC_MARKETING_ROUTES.has(pathname);

  const routeTier = isAdminRoute
    ? "admin_console"
    : isAuthRoute
      ? "auth"
      : isPublicRoute
        ? "public_marketing"
        : "sanctuary_app";

  const enforceStrictAuth = process.env.NEXT_PUBLIC_ENFORCE_STRICT_AUTH === "true";
  const hasSessionCookie = Boolean(request.cookies.get("inneros_session")?.value);

  if (enforceStrictAuth && (routeTier === "sanctuary_app" || routeTier === "admin_console") && !hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-InnerOS-Route-Tier", routeTier);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), geolocation=(), payment=(), usb=(), microphone=(self)"
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
