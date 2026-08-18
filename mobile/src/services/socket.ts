import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api';

function sanitizeSocketHost(url: string) {
  if (!url) return url;
  const trimmed = url.trim();
  const cleaned = trimmed.replace(/\/api$/, '').replace(/\/$/, '');
  if (cleaned.includes('<') || cleaned.includes('>') || cleaned.includes('YOUR_MACHINE_IP')) {
    return 'http://10.0.2.2:5000';
  }
  return cleaned;
}

const SOCKET_HOST = sanitizeSocketHost(API_URL);
console.log('mobile: SOCKET_HOST ->', SOCKET_HOST);

let socket: Socket | null = null;

export const connectSocket = async () => {
  try {
    const raw = await AsyncStorage.getItem('ridesafe-auth');
    const parsed = raw ? JSON.parse(raw) : null;
    const token = parsed?.token || null;

    if (socket && socket.connected) {
      return socket;
    }

    if (SOCKET_HOST.includes('localhost') || SOCKET_HOST.includes('127.0.0.1')) {
      console.warn('mobile: Socket host is localhost; this only works on web/desktop. Use LAN IP for Expo Go on a phone.', SOCKET_HOST);
      return null;
    }

    socket = io(SOCKET_HOST, {
      autoConnect: false,
      transports: ['polling', 'websocket'],
      timeout: 15000,
      forceNew: true,
      auth: token ? { token } : undefined,
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect_error', (error) => {
      console.error('mobile: Socket connect_error', error.message, 'host=', SOCKET_HOST);
    });

    socket.connect();
    return socket;
  } catch (e) {
    console.error('Failed to connect socket', e);
    return null;
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export default socket;
