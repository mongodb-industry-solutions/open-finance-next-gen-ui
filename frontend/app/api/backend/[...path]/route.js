/**
 * Runtime proxy for core backend API.
 *
 * Replaces the next.config.mjs rewrite which bakes the backend URL at build
 * time. This Route Handler reads CORE_BACKEND_URL at runtime so the
 * deployed container picks up the env var from the Helm chart.
 *
 * Maps: /api/backend/<path> → CORE_BACKEND_URL/api/v1/<path>
 */

const CORE_BACKEND =
  process.env.CORE_BACKEND_URL || "http://localhost:8003";

async function proxy(request, { params }) {
  const { path } = await params;
  let backendPath = `/api/v1/${path.join("/")}`;

  // Preserve trailing slash for FastAPI (avoids 307 redirects)
  if (request.nextUrl.pathname.endsWith("/")) {
    backendPath += "/";
  }

  const backendUrl = `${CORE_BACKEND}${backendPath}${request.nextUrl.search}`;

  const headers = new Headers();
  headers.set("Content-Type", request.headers.get("Content-Type") || "application/json");

  // Forward Authorization header if present
  const auth = request.headers.get("Authorization");
  if (auth) {
    headers.set("Authorization", auth);
  }

  const fetchOptions = {
    method: request.method,
    headers,
  };

  // Forward body for non-GET requests
  if (request.method !== "GET" && request.method !== "HEAD") {
    fetchOptions.body = await request.text();
  }

  const backendRes = await fetch(backendUrl, fetchOptions);

  return new Response(backendRes.body, {
    status: backendRes.status,
    headers: {
      "Content-Type": backendRes.headers.get("Content-Type") || "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
