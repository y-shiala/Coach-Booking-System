'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuthToken,
  getAuthUser,
  setAuthToken,
  setAuthUser,
  clearAuth,
  StoredUser,
} from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { User } from '@/lib/types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: StoredUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'coach' | 'customer') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: 'coach' | 'customer';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getAuthUser();

    if (token && storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  
  const fetchAndStoreUser = async (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    const userId = decoded.sub;

    const userData = await apiClient.get<User>(`/users/${userId}`);

    const storedUser: StoredUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role as 'coach' | 'customer',
      bio: userData.bio,
      pricePerHour: userData.price_per_hour,
    };

    setAuthToken(token);
    setAuthUser(storedUser);
    setUser(storedUser);
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<{ access_token: string }>('/auth/login', {
      email,
      password,
    });

    await fetchAndStoreUser(response.access_token);
    router.push('/dashboard');
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'coach' | 'customer'
  ) => {
    const response = await apiClient.post<{ access_token: string }>('/auth/register', {
      name,
      email,
      password,
      role,
    });

    console.log('Register response:', response);
    await fetchAndStoreUser(response.access_token);
    router.push('/dashboard');
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    router.push('/auth/login');
  };

  const refreshUser = async () => {
    try {
      if (!user) return;
      const userData = await apiClient.get<User>(`/users/${user.id}`);

      const updatedUser: StoredUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as 'coach' | 'customer',
        bio: userData.bio,
        pricePerHour: userData.price_per_hour,
      };

      setAuthUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to refresh user', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}