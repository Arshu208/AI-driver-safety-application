import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { api } from './api';
import { useAuthStore } from '../store/authStore';

export async function enrollFaceLock() {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error('Sign in before enabling Face Lock');
  const options = await api.post('/auth/face-lock/register/options', { userId });
  const response = await startRegistration({ optionsJSON: options.data });
  await api.post('/auth/face-lock/register/verify', { userId, response });
}

export async function signInWithFaceLock(phone: string) {
  const options = await api.post('/auth/face-lock/login/options', { phone });
  const response = await startAuthentication({ optionsJSON: options.data });
  const result = await api.post('/auth/face-lock/login/verify', { phone, response });
  useAuthStore.getState().login(result.data.user, result.data.token);
}
