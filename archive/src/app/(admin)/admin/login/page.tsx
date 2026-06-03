'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { clientAuthLog } from '@/lib/auth-debug-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, loading, user } = useAuth();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user && !isLoading) {
      clientAuthLog('LoginPage', 'already authenticated, redirecting', {
        hasUser: !!user,
      });
      // Use replace to avoid adding to history
      router.replace('/admin');
    }
  }, [user, loading, isLoading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);

      clientAuthLog('LoginPage', 'login() completed', { success });

      if (success) {
        toast.success('Login successful');
        clientAuthLog('LoginPage', 'redirecting to /admin');

        // Full navigation so the new httpOnly cookie is always sent on the next
        // request (client router alone can miss cookie timing on production HTTPS).
        window.location.assign('/admin');
      } else {
        clientAuthLog('LoginPage', 'login failed, staying on page');
        toast.error('Invalid credentials');
      }
    } catch (error) {
      clientAuthLog('LoginPage', 'unexpected login error', {
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                className='border-gray-300 dark:border-gray-700'
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                className='border-gray-300 dark:border-gray-700'
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full dark:text-white" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

