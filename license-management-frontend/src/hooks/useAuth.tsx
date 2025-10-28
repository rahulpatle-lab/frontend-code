import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContextType, User, CustomerSignupRequest } from '../types';
import apiService from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'customer') => {
    try {
      setIsLoading(true);

      if (role === 'admin') {
        const response = await apiService.adminLogin({ email, password });
        setUser({
          email: response.email,
          role: 'admin',
        });
        setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({ email: response.email, role }));
      } else {
        const response = await apiService.customerLogin({ email, password });
        setUser({
          email: response.email,
          name: response.name,
          phone: response.phone,
          role: 'customer',
        });
        setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          name: response.name,
          phone: response.phone,
          role,
        }));
      }

      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: CustomerSignupRequest) => {
    try {
      setIsLoading(true);
      const response = await apiService.customerSignup(data);

      setToken(response.token);
      setUser({
        email: response.email,
        name: response.name,
        phone: response.phone,
        role: 'customer',
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.email,
        name: response.name,
        phone: response.phone,
        role: 'customer',
      }));

      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
