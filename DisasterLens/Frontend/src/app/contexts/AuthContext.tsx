import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import type { User, AuthState, LoginCredentials, SignupData } from '../types';
import { api } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'resilience_ai_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  // Check for existing auth on mount
  useEffect(() => {
    void checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const parsedAuth: AuthState = JSON.parse(storedAuth);
        if (parsedAuth.token && parsedAuth.user) {
          const user = await api.get<User>('/auth/me', parsedAuth.token);
          const restored: AuthState = {
            isAuthenticated: true,
            user,
            token: parsedAuth.token,
            isLoading: false,
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(restored));
          setAuthState(restored);
          return;
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const authPayload = await api.post<{ access_token: string; user: User }>('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: authPayload.user,
        token: authPayload.access_token,
        isLoading: false,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      setAuthState(newAuthState);
      
      toast.success('Login successful');
      return authPayload.user;
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

      const authPayload = await api.post<{ access_token: string; user: User }>('/auth/register', {
        name: data.name,
        nameBn: data.nameBn,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        assignedArea: data.assignedArea,
        assignedAreaBn: data.assignedAreaBn,
      });

      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: authPayload.user,
        token: authPayload.access_token,
        isLoading: false,
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
      isLoading: false,
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
