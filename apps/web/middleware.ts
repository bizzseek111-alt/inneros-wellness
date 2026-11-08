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
  "/parents",
  "/schools",
  "/adhd-support",
  "/autism-support",
  "/emotional-intelligence",
  "/cognitive-development",
  "/languages",
  "/research",
  "/privacy",
  "/terms",
  "/child-safety",
  "/accessibility",
  "/demos",
  "/platform",
  "/technology",
  "/trust",
  "/schools/pilot",
  "/documents",
  "/creative-studio",
  "/learning-method",
  "/ai-creator",
  "/ai-creator-academy",
  "/ai-literacy",
  "/brain-skills",
  "/inclusive-learning",
  "/child-development",
  "/access",
]);


const AUTH_ROUTES = new Set(["/login", "/signup", "/onboarding"]);

/**
 * InnerOS / Weebly Next.js Edge Middleware
 * - Classifies route tier (public_marketing, auth, admin_console, kids_sanctuary, youth_sanctuary, caregiver_portal, teacher_portal, school_portal, professional_portal, sanctuary_app)
 * - Enforces session cookie presence on protected routes when NEXT_PUBLIC_ENFORCE_STRICT_AUTH === "true"
 * - Applies defense-in-depth HTTP security headers across all web responses
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isKidsRoute = pathname.startsWith("/kids");
  const isTeensRoute = pathname.startsWith("/teens");
  const isYouthRoute = pathname.startsWith("/youth");
  const isCaregiverRoute = pathname.startsWith("/caregiver") || pathname.startsWith("/parent");
  const isTeacherRoute = pathname.startsWith("/teacher");
  const isSchoolRoute = pathname.startsWith("/school/") || pathname === "/school";
  const isProfessionalRoute = pathname.startsWith("/professional");
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isPublicRoute = PUBLIC_MARKETING_ROUTES.has(pathname);

  const routeTier = isAdminRoute
    ? "admin_console"
    : isKidsRoute
      ? "kids_sanctuary"
      : isTeensRoute
        ? "teens_sanctuary"
        : isYouthRoute
          ? "youth_sanctuary"
          : isCaregiverRoute
            ? "caregiver_portal"
            : isTeacherRoute
              ? "teacher_portal"
              : isSchoolRoute
                ? "school_portal"
                : isProfessionalRoute
                  ? "professional_portal"
                  : isAuthRoute
                    ? "auth"
                    : isPublicRoute
                      ? "public_marketing"
                      : "sanctuary_app";

  const enforceStrictAuth = process.env.NEXT_PUBLIC_ENFORCE_STRICT_AUTH === "true";
  const hasSessionCookie = Boolean(request.cookies.get("inneros_session")?.value);

  if (enforceStrictAuth && (routeTier === "sanctuary_app" || routeTier === "admin_console" || routeTier === "caregiver_portal") && !hasSessionCookie) {
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|sw\\.js|manifest\\.webmanifest|api/).*)"],
};
