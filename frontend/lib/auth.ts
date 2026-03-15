export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coach' | 'customer';
  bio?: string;
  pricePerHour?: number;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function setAuthUser(user: StoredUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getAuthUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function clearAuthUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuth(): void {
  clearAuthToken();
  clearAuthUser();
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
