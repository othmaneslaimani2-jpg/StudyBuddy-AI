export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
