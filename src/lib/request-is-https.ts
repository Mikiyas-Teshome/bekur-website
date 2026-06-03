import type { NextRequest } from "next/server";

/**
 * True when the original client request was HTTPS (TLS terminated at proxy or direct).
 * Needed so Set-Cookie uses Secure when users hit https:// while Node sees http:// internally.
 */
export function isHttpsRequest(request: NextRequest): boolean {
  if (request.nextUrl.protocol === "https:") return true;

  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    const first = forwardedProto.split(",")[0]?.trim().toLowerCase();
    if (first === "https") return true;
  }

  if (request.headers.get("x-forwarded-ssl") === "on") return true;

  const forwarded = request.headers.get("forwarded");
  if (forwarded && /proto=https/i.test(forwarded)) return true;

  return false;
}
