import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
