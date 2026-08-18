import { api } from '../api';

export function searchPlaces(query: string) {
  return api.get('/navigation/search', { params: { q: query } });
}

export function getNearbyPlaces(lat: number, lon: number, query = 'rest stop fuel station hospital emergency') {
  return api.get('/navigation/nearby', { params: { lat, lon, q: query } });
}

export function getEmergencyContacts() {
  return api.get('/navigation/emergency');
}
