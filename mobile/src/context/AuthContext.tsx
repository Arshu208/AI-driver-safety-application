import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { login as loginApi, register as registerApi } from '../services/auth';
import { connectSocket, getSocket, disconnectSocket } from '../services/socket';
import { RegisterData, User } from '../types';

const STORAGE_KEY = 'ridesafe-auth';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed.user);
          setToken(parsed.token);
          // If we loaded an existing token, connect socket for realtime updates
          try {
            await connectSocket();
            const socket = getSocket();
            socket?.on('profile:updated', ({ user: updatedUser }) => {
              if (updatedUser?.id === parsed.user.id) {
                setUser(updatedUser);
                persistAuth(updatedUser, parsed.token);
              }
            });
          } catch (e) {
            console.error('Socket connect failed on load', e);
          }
        }
      } catch (error) {
        console.error('Failed to load auth state', error);
      } finally {
        setLoading(false);
      }
    };
    void loadAuth();
  }, []);

  const persistAuth = async (nextUser: User | null, nextToken: string | null) => {
    if (nextUser && nextToken) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const signIn = async (phone: string, password: string) => {
    try {
      console.log('mobile: attempting signIn', phone ? phone.replace(/.(?=.{2})/g, '*') : '(no-phone)');
      const response = await loginApi(phone, password);
      console.log('mobile: signIn response', response?.data?.user?.id);
      setUser(response.data.user);
      setToken(response.data.token);
      await persistAuth(response.data.user, response.data.token);
      try {
        await connectSocket();
        const socket = getSocket();
        socket?.on('profile:updated', ({ user: updatedUser }) => {
          console.log('mobile: received profile:updated', updatedUser?.id);
          if (updatedUser?.id === response.data.user.id) {
            console.log('mobile: applying profile update from socket');
            setUser(updatedUser);
            persistAuth(updatedUser, response.data.token);
          }
        });
      } catch (e) { console.error('Socket connect failed', e); }
      return;
    } catch (err: unknown) {
      const details = axios.isAxiosError(err)
        ? (err.response?.data || err.message)
        : String(err);
      console.error('mobile: signIn failed', details);
      throw err;
    }
  };

  const signUp = async (data: RegisterData) => {
    const response = await registerApi(data);
    setUser(response.data.user);
    setToken(response.data.token);
    await persistAuth(response.data.user, response.data.token);
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await persistAuth(null, null);
    disconnectSocket();
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updates };
    setUser(nextUser);
    if (token) {
      await persistAuth(nextUser, token);
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, signIn, signUp, signOut, updateProfile }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
