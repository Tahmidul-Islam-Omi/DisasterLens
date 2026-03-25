import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import type { User, AuthState, LoginCredentials, SignupData } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'resilience_ai_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Check for existing auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const parsedAuth: AuthState = JSON.parse(storedAuth);
        // Validate that the stored data has required fields
        if (parsedAuth.token && parsedAuth.user) {
          setAuthState(parsedAuth);
        } else {
          // Invalid stored data, clear it
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        nameBn: 'টেস্ট ইউজার',
        email: credentials.email,
        role: credentials.role,
        avatar: undefined,
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockToken,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      setAuthState(newAuthState);
      
      toast.success('Login successful');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords must match');
      }

      // Validate password length
      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: Date.now().toString(),
        name: data.name,
        nameBn: data.nameBn,
        email: data.email,
        phone: data.phone,
        role: data.role,
        avatar: undefined,
        assignedArea: data.assignedArea,
        assignedAreaBn: data.assignedAreaBn,
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockToken,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      setAuthState(newAuthState);
      
      toast.success('Account created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
