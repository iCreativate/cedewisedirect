import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDashboardPathAllowed, roleDashboardPath, type UserRole } from "@/lib/rbac";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Allow public auth routes and NextAuth API to pass through
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    // For API routes, return a proper status code instead of redirecting HTML.
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard")) {
    // Allow the dashboard root so the server page can redirect by role
    if (pathname === "/dashboard") {
      return NextResponse.next();
    }
    const role = (token as any).role as UserRole | undefined;
    if (!role) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "missing_role" }, { status: 401 });
      }
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("error", "missing_role");
      return NextResponse.redirect(url);
    }
    if (!isDashboardPathAllowed(role, pathname)) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
      // Don't "kick out" to login; redirect back to the user's dashboard home.
      const url = new URL(roleDashboardPath[role], req.url);
      url.searchParams.set("error", "forbidden");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/submissions/:path*",
  ],
};

