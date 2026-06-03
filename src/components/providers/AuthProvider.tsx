"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clientAuthLog } from "@/lib/auth-debug-client";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Check if current route is admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // Only check auth if on admin routes
    if (isAdminRoute) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isAdminRoute]);

  // Check auth on every page load (only for admin routes)
  useEffect(() => {
    if (!isAdminRoute) return;

    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAdminRoute]);

  const checkAuth = async (): Promise<boolean> => {
    if (!isAdminRoute) return false;

    try {
      clientAuthLog("AuthProvider", "checking authentication", {
        pathname,
        isAdminRoute,
      });
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Ensure cookies are included
      });
      clientAuthLog("AuthProvider", "auth check response", {
        status: response.status,
        ok: response.ok,
      });
      if (response.ok) {
        const userData = await response.json();
        clientAuthLog("AuthProvider", "auth user loaded", {
          userId: userData?.user?.id,
          email: userData?.user?.email,
        });
        setUser(userData.user);
        return true;
      }
      clientAuthLog("AuthProvider", "no valid session found");
      setUser(null);
      return false;
    } catch (error) {
      clientAuthLog("AuthProvider", "auth check failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      clientAuthLog("AuthProvider", "starting login", { email });
      setLoading(true); // Set loading to true during login

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are included
      });

      clientAuthLog("AuthProvider", "login response received", {
        status: response.status,
        ok: response.ok,
      });

      if (response.ok) {
        const data = await response.json();
        clientAuthLog("AuthProvider", "login API success", {
          userId: data?.user?.id,
          email: data?.user?.email,
        });
        setUser(data.user);

        // Confirm cookie was stored (production HTTPS needs Secure cookies)
        const sessionOk = await checkAuth();
        clientAuthLog("AuthProvider", "post-login session check", { sessionOk });
        return sessionOk;
      }
      clientAuthLog("AuthProvider", "login failed, non-ok response");
      setLoading(false);
      return false;
    } catch (error) {
      clientAuthLog("AuthProvider", "login request failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
