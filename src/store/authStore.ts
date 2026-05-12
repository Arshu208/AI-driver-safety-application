import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'DRIVER' | 'FLEET_MANAGER';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
