import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserLogin, UserRegister, Token } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token by fetching user data
      apiService.getCurrentUser()
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: UserLogin) => {
    try {
      const token: Token = await apiService.login(credentials);
      localStorage.setItem('token', token.access_token);
      
      // Fetch real user data from backend
      const user = await apiService.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: UserRegister) => {
    try {
      const newUser = await apiService.register(userData);
      setUser(newUser);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!localStorage.getItem('token'),
        isLoading,
        login,
        register,
        logout,
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
