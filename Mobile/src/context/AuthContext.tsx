import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * @deprecated Prefer using `useAuthStore` directly from `@/store/authStore`.
 * This provider is kept for backward compatibility with Context API consumers.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const store = useAuthStore();
  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useAuthStore();

export default AuthContext;
