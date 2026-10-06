import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';
import { AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Failed to load token:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token } = response.data;
    await SecureStore.setItemAsync('userToken', token);
    setUserToken(token);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    const { token } = response.data;
    await SecureStore.setItemAsync('userToken', token);
    setUserToken(token);
  };

  const logout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('userToken');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
