import { api } from '../api';

export function startTrip(userId?: string) {
  return api.post('/trips/start', { userId });
}

export function endTrip(tripId: string) {
  return api.post(`/trips/${tripId}/end`);
}

export function getTripSummary(tripId: string) {
  return api.get(`/trips/${tripId}/summary`);
}

export function getTripHistory(userId: string) {
  return api.get('/trips', { params: { userId } });
}
