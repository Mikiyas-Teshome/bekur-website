import { NextRequest, NextResponse } from "next/server";
import { isHttpsRequest } from "@/lib/request-is-https";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  const useSecureCookies = isHttpsRequest(request);

  // Clear the auth token cookie (options must match login for reliable removal)
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
