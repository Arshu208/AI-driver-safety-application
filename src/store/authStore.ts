import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { disconnectSocket } from '../services/socket';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'DRIVER' | 'FLEET_MANAGER';
  vehicleNumber?: string;
  emergencyContact?: string;
  safetyScore?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    disconnectSocket();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}), {
  name: 'ridesafe-auth',
}));
