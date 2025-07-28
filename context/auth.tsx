"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: any;
  role: number;
}

interface AuthContextType {
  auth: {
    user: User | null;
    token: string | null;
  };
  setAuth: (auth: { user: User | null; token: string | null }) => void;
  logout: () => void;
  isHydrated: boolean;
  isAdmin: () => boolean;
  isSeller: () => boolean;
  isBuyer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<{ user: User | null; token: string | null }>({
    user: null,
    token: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Set axios default authorization header
  useEffect(() => {
    if (isHydrated && auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else if (isHydrated) {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token, isHydrated]);

  // Load auth from localStorage on mount (client-side only)
  useEffect(() => {
    const loadAuth = () => {
      try {
        const data = localStorage.getItem("auth");
        if (data) {
          const parseData = JSON.parse(data);
          setAuth({
            user: parseData.user,
            token: parseData.token,
          });
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem("auth");
      } finally {
        setIsHydrated(true);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      loadAuth();
    }
  }, []);

  const logout = () => {
    setAuth({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth");
    }
    delete axios.defaults.headers.common["Authorization"];
  };

  // Custom setAuth that also updates localStorage
  const updateAuth = (newAuth: { user: User | null; token: string | null }) => {
    setAuth(newAuth);
    if (typeof window !== 'undefined') {
      if (newAuth.user && newAuth.token) {
        localStorage.setItem("auth", JSON.stringify(newAuth));
      } else {
        localStorage.removeItem("auth");
      }
    }
  };

  // Role check functions
  const isAdmin = () => auth.user?.role === 2;
  const isSeller = () => auth.user?.role === 1;
  const isBuyer = () => auth.user?.role === 0;

  return (
    <AuthContext.Provider value={{ 
      auth, 
      setAuth: updateAuth, 
      logout, 
      isHydrated,
      isAdmin,
      isSeller,
      isBuyer
    }}>
      {children}
    </AuthContext.Provider>
  );
};