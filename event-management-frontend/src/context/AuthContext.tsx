// src/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/lib/api';
import { useRouter } from 'next/navigation';

// Define the shape of the user
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'organizer' | 'attendee';
  status?: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    email: string;
    full_name: string;
    password: string;
    role?: 'admin' | 'organizer' | 'attendee';
  }) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication on mount
    async function checkAuth() {
      try {
        // Check if token exists
        const token = localStorage.getItem('authToken');
        if (token) {
          // Fetch user details 
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData } = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      router.push('/events');
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const register = async (userData: {
    email: string;
    full_name: string;
    password: string;
    role?: 'admin' | 'organizer' | 'attendee';
  }) => {
    try {
      await authService.register(userData);
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  // If loading, you might want to show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register, 
        isAuthenticated,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}