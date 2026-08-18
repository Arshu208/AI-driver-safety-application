import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const AUTH_STORAGE_KEY = 'ridesafe-auth';

function isValidLanHost(value?: string) {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('<') || trimmed.includes('>') || trimmed.includes('YOUR_MACHINE_IP')) {
    return false;
  }
  return !trimmed.includes('localhost') && !trimmed.includes('127.0.0.1');
}

function isValidApiUrl(value?: string) {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('<') || trimmed.includes('>') || trimmed.includes('YOUR_MACHINE_IP')) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function resolveMobileBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  const lanHost = process.env.EXPO_PUBLIC_LAN_HOST?.trim();
  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0]?.trim();

  console.log('mobile: API resolution - expoHost:', expoHost, 'envUrl:', envUrl, 'lanHost:', lanHost);

  if (isValidApiUrl(envUrl)) {
    console.log('mobile: Using LAN IP from env:', envUrl);
    return envUrl;
  }

  if (isValidLanHost(lanHost)) {
    const derived = `http://${lanHost}:5000/api`;
    console.log('mobile: Using LAN host from Expo env:', derived);
    return derived;
  }

  if (isValidLanHost(expoHost)) {
    const derived = `http://${expoHost}:5000/api`;
    console.log('mobile: Using Expo host IP:', derived);
    return derived;
  }

  if (Platform.OS === 'android') {
    console.log('mobile: Android emulator detected, using 10.0.2.2');
    return 'http://10.0.2.2:5000/api';
  }

  console.log('mobile: Using default localhost fallback');
  return 'http://localhost:5000/api';
}

export const API_URL = resolveMobileBaseUrl();
console.log('mobile: API_URL ->', API_URL);
export const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use(async (config) => {
  const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      // ignore malformed auth storage
    }
  }
  return config;
});
