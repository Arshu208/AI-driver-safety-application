import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TripState {
  isActiveTrip: boolean;
  tripId: string | null;
  startTime: number | null;
  distanceMiles: number;
  safetyScore: number;
  
  startTrip: (id: string) => void;
  endTrip: () => void;
  updateTripStats: (distance: number, score: number) => void;
}

export const useTripStore = create<TripState>()(persist((set) => ({
  isActiveTrip: false,
  tripId: null,
  startTime: null,
  distanceMiles: 0,
  safetyScore: 100,

  startTrip: (id) => set({ isActiveTrip: true, tripId: id, startTime: Date.now(), distanceMiles: 0, safetyScore: 100 }),
  endTrip: () => set({ isActiveTrip: false, tripId: null, startTime: null }),
  updateTripStats: (distance, score) => set({ distanceMiles: distance, safetyScore: score })
}), {
  name: 'ridesafe-trip',
}));
