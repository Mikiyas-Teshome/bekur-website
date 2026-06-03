import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/jwt-edge';
import { maskToken, serverAuthLog } from '@/lib/auth-debug';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  serverAuthLog('proxy', 'incoming request', {
    pathname,
    method: request.method,
    token: maskToken(token),
    forwardedProto: request.headers.get('x-forwarded-proto'),
    forwardedFor: request.headers.get('x-forwarded-for'),
    host: request.headers.get('host'),
    forwarded: request.headers.get('forwarded'),
  });

  // Handle login page - redirect authenticated users to admin
  if (pathname === '/admin/login') {
    if (token) {
      const user = await verifyTokenEdge(token);
      serverAuthLog('proxy', 'login route token validation', {
        valid: !!user,
      });
      if (user) {
        serverAuthLog('proxy', 'redirecting authenticated user', {
          from: '/admin/login',
          to: '/admin',
        });
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
    serverAuthLog('proxy', 'allowing /admin/login');
    return NextResponse.next();
  }

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      serverAuthLog('proxy', 'redirecting: missing auth token', {
        from: pathname,
        to: '/admin/login',
      });
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const user = await verifyTokenEdge(token);
    serverAuthLog('proxy', 'admin token validation', {
      valid: !!user,
      token: maskToken(token),
    });
    if (!user) {
      serverAuthLog('proxy', 'redirecting: invalid auth token', {
        from: pathname,
        to: '/admin/login',
      });
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  serverAuthLog('proxy', 'request allowed', { pathname });
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
