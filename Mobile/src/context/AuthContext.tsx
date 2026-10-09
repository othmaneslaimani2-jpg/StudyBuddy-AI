import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';
import { AuthContextType, User } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const userInfo = await SecureStore.getItemAsync('userInfo');
        if (token && userInfo) {
          setUserToken(token);
          setUser(JSON.parse(userInfo));
        }
      } catch (e) {
        console.error('Failed to load storage data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userInfo', JSON.stringify(userData));
    setUserToken(token);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response = await apiClient.post('/auth/signup', { fullName: name, email, password });
    const { token, user: userData } = response.data;
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userInfo', JSON.stringify(userData));
    setUserToken(token);
    setUser(userData);
  };

  const logout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userInfo');
    setUserToken(null);
    setUser(null);
  };

  const updateUser = async (updatedUser: User): Promise<void> => {
    setUser(updatedUser);
    await SecureStore.setItemAsync('userInfo', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
