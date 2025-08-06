// filepath: c:\Users\Administrator\Desktop\JAMIIFUND DASHBOARD\dashboard\src\context\AuthContext.jsx
'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Create context
const AuthContext = createContext();

/**
 * Auth Provider Component
 * 
 * Manages authentication state across the application
 * Handles session persistence and redirects
 * Provides admin user data to components
 */
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for active session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get admin data from API
        const response = await fetch('/api/admin/session');
        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
        } else {
          setAdmin(null);
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router, pathname]);

  // Sign out function
  const signOut = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setAdmin(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setAdmin(data.admin);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Context value
  const value = {
    admin,
    loading,
    signOut,
    login
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};