import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { maskToken, serverAuthLog } from '@/lib/auth-debug';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    serverAuthLog('api/auth/me', 'session check request', {
      token: maskToken(token),
      cookies: request.cookies.getAll().map((c) => c.name),
      forwardedProto: request.headers.get('x-forwarded-proto'),
      host: request.headers.get('host'),
    });

    if (!token) {
      serverAuthLog('api/auth/me', 'no auth token');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = verifyToken(token);
    serverAuthLog('api/auth/me', 'token verification completed', { valid: !!user });

    if (!user) {
      serverAuthLog('api/auth/me', 'invalid auth token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    serverAuthLog('api/auth/me', 'authenticated user', { email: user.email });
    return NextResponse.json({ user });
  } catch (error) {
    serverAuthLog('api/auth/me', 'unexpected error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
