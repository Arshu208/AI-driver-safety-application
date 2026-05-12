import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We'll connect when needed
  transports: ['websocket'],
});

export const connectSocket = (token?: string) => {
  if (token) {
    socket.auth = { token };
  }
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
