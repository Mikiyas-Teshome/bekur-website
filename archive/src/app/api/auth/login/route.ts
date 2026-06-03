import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, generateToken } from '@/lib/auth';
import { isHttpsRequest } from '@/lib/request-is-https';
import { maskToken, serverAuthLog } from '@/lib/auth-debug';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    serverAuthLog('api/auth/login', 'login request received', {
      email,
      forwardedProto: request.headers.get('x-forwarded-proto'),
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
    });

    if (!email || !password) {
      serverAuthLog('api/auth/login', 'missing credentials');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await verifyCredentials(email, password);

    if (!user) {
      serverAuthLog('api/auth/login', 'invalid credentials', { email });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    serverAuthLog('api/auth/login', 'token generated', {
      email: user.email,
      token: maskToken(token),
    });

    const response = NextResponse.json(
      { 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
      { status: 200 }
    );

    // Browsers reject non-Secure cookies on HTTPS pages. Behind nginx/Cloudflare,
    // Next often sees http:// — infer HTTPS from forwarded headers.
    const useSecureCookies = isHttpsRequest(request);

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax" as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    };
    
    serverAuthLog('api/auth/login', 'setting auth cookie', {
      ...cookieOptions,
      secure: useSecureCookies,
    });
    response.cookies.set('auth-token', token, cookieOptions);

    serverAuthLog('api/auth/login', 'login success response sent', {
      email: user.email,
    });
    return response;
  } catch (error) {
    serverAuthLog('api/auth/login', 'unexpected error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
