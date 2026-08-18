export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleNumber?: string;
  emergencyContact?: string;
  safetyScore: number;
  role: 'DRIVER';
};

export type RegisterData = {
  name: string;
  phone: string;
  email?: string;
  password: string;
  vehicleNumber?: string;
  emergencyContact?: string;
};

export type TripRecord = {
  id: string;
  title: string;
  startedAt: string;
  endedAt?: string;
  fatigueLevel: number;
  isDrowsy: boolean;
};
