import { api } from '../api';
import { RegisterData } from '../types';

export function login(phone: string, password: string) {
  return api.post('/auth/login', { phone, password });
}

export function register(data: RegisterData) {
  return api.post('/auth/register', data);
}
