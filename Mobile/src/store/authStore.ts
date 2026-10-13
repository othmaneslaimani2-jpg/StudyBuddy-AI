import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';
import { User } from '../types/auth';

export interface AuthState {
  userToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userToken: null,
      user: null,
      isLoading: true,

      login: async (email: string, password: string): Promise<void> => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token, user: userData } = response.data;
        set({ userToken: token, user: userData });
      },

      register: async (name: string, email: string, password: string): Promise<void> => {
        const response = await apiClient.post('/auth/signup', { fullName: name, email, password });
        const { token, user: userData } = response.data;
        set({ userToken: token, user: userData });
      },

      logout: async (): Promise<void> => {
        set({ userToken: null, user: null });
        try {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userInfo');
        } catch (e) {
          // ignore
        }
      },

      updateUser: async (updatedUser: User): Promise<void> => {
        set({ user: updatedUser });
      },

      setIsLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userToken: state.userToken,
        user: state.user,
      }),
      onRehydrateStorage: () => {
        return async (state, error) => {
          if (error) {
            console.error('Failed to rehydrate auth storage:', error);
          }
          // Legacy migration check: if no token in AsyncStorage, check SecureStore
          if (!state?.userToken) {
            try {
              const legacyToken = await SecureStore.getItemAsync('userToken');
              const legacyUser = await SecureStore.getItemAsync('userInfo');
              if (legacyToken && legacyUser) {
                useAuthStore.setState({
                  userToken: legacyToken,
                  user: JSON.parse(legacyUser),
                });
              }
            } catch (err) {
              console.warn('Failed to check legacy storage:', err);
            }
          }
          useAuthStore.setState({ isLoading: false });
        };
      },
    }
  )
);
