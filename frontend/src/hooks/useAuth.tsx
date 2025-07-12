import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const response = await api.get('/users/me/');
          setUser(response.data as User);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('useAuth: Starting login process for:', email);
    try {
      const response = await api.post('/token/', { login: email, password });
      console.log('useAuth: Token response received:', response.status);
      const { access, refresh } = response.data as { access: string; refresh: string };
      
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      console.log('useAuth: Tokens stored in localStorage');

      console.log('useAuth: Fetching user data...');
      const userResponse = await api.get('/users/me/');
      console.log('useAuth: User data response:', userResponse.status);
      const userData = userResponse.data as User;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('useAuth: Login process completed successfully for user:', userData.email);
    } catch (error) {
      console.error('useAuth: Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
