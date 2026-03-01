import { NextResponse } from "next/server";

/**
 * Middleware to proxy OpenFinance secure API requests directly to the backend,
 * preserving trailing slashes and Authorization headers.
 *
 * Problem: Next.js rewrite `:path*` strips trailing slashes. FastAPI requires
 * them and returns a 307 redirect. The 307 redirect drops the Authorization
 * header (standard HTTP behavior), causing 401/403 errors.
 *
 * Fix: For secure endpoints, rewrite directly to the full backend URL with
 * the trailing slash intact — bypassing the config rewrite entirely.
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // Only intercept secure OpenFinance endpoints (the ones that need auth)
  if (pathname.startsWith("/api/backend/openfinance/secure/")) {
    const backendBase =
      process.env.CORE_BACKEND_URL || "http://localhost:8003";

    // Map /api/backend/... → /api/v1/...
    let backendPath = pathname.replace("/api/backend/", "/api/v1/");

    // Ensure trailing slash so FastAPI doesn't 307 redirect
    if (!backendPath.endsWith("/")) {
      backendPath += "/";
    }

    return NextResponse.rewrite(new URL(`${backendBase}${backendPath}${search}`));
  }
}

export const config = {
  matcher: "/api/backend/:path*",
};
