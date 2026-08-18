import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors, styles } from '../theme';
import { getEmergencyContacts, getNearbyPlaces, searchPlaces as searchPlacesApi } from '../services/navigation';

// Conditionally import location module only on native
let Location: any = null;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

type PlaceItem = {
  id: string;
  name: string;
  distanceKm: number;
  lat: string;
  lon: string;
  type: 'Rest Stop' | 'Help Center';
};

export default function RestPlacesScreen() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [error, setError] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<Array<{ id: string; label: string; number: string }>>([]);

  useEffect(() => {
    const loadNearby = async () => {
      try {
        setLoading(true);
        setError('');

        let latitude: number | null = null;
        let longitude: number | null = null;

        if (Platform.OS === 'web') {
          // On web, use browser geolocation API
          try {
            if ('geolocation' in navigator) {
              await new Promise<void>((resolve) => {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    setCoords({ latitude, longitude });
                    resolve();
                  },
                  (error) => {
                    console.warn('Web geolocation error:', error);
                    resolve();
                  }
                );
              });
            }
          } catch (webLocationError) {
            console.warn('mobile: web location unavailable for rest places', webLocationError);
          }
        } else {
          // Native location
          try {
            const permission = await Location?.requestForegroundPermissionsAsync?.();
            if (permission?.status === 'granted') {
              const current = await Location?.getCurrentPositionAsync?.({});
              latitude = current?.coords?.latitude ?? null;
              longitude = current?.coords?.longitude ?? null;
              setCoords(latitude !== null && longitude !== null ? { latitude, longitude } : null);
            }
          } catch (locationError) {
            console.warn('mobile: location unavailable for rest places', locationError);
          }
        }

        const response = latitude !== null && longitude !== null
          ? await getNearbyPlaces(latitude, longitude)
          : await searchPlacesApi('rest stop fuel station hospital emergency');

        const data = response.data?.places ?? [];
        const emergency = await getEmergencyContacts();
        setEmergencyContacts(emergency.data?.contacts ?? []);

        const mapped: PlaceItem[] = (Array.isArray(data) ? data : []).map((item: any) => {
          const hasCoords = latitude !== null && longitude !== null;
          const fallbackDLat = hasCoords ? (Number(item.lat) - (latitude as number)) : 0;
          const fallbackDLon = hasCoords ? (Number(item.lon) - (longitude as number)) : 0;
          const fallbackDistanceKm = hasCoords ? Math.sqrt((fallbackDLat * 111) ** 2 + (fallbackDLon * 111) ** 2) : 0;
          const distanceKm = typeof item.distanceKm === 'number' ? item.distanceKm : fallbackDistanceKm;
          const displayName = String(item.display_name || 'Nearby place').split(',')[0];
          const kind: PlaceItem['type'] = /hospital|clinic|medical/i.test(String(item.display_name || '')) ? 'Help Center' : 'Rest Stop';
          return {
            id: String(item.place_id || `${displayName}-${Math.random()}`),
            name: displayName,
            distanceKm,
            lat: item.lat,
            lon: item.lon,
            type: kind,
          };
        }).sort((a, b) => a.distanceKm - b.distanceKm);

        setPlaces(mapped);
        if (mapped.length === 0) {
          setError('No nearby places found. Try again in a different area.');
        } else if (latitude === null || longitude === null) {
          setError('Location permission denied. Showing general nearby places without distance.');
        }
      } catch (e) {
        console.warn('mobile: rest places failed', e);
        setError('Unable to load nearby places from backend API.');
      } finally {
        setLoading(false);
      }
    };

    void loadNearby();
  }, []);

  const openRoute = async (item: PlaceItem) => {
    const url = coords
      ? `https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${item.lat},${item.lon}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return;
    }
    if (coords) {
      await Linking.openURL(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${coords.latitude}%2C${coords.longitude}%3B${item.lat}%2C${item.lon}`);
      return;
    }
    await Linking.openURL(`https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lon}#map=14/${item.lat}/${item.lon}`);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Rest Places & Emergency Support</Text>
        <Text style={styles.subtitle}>Use the same safety network as the web app for rest stops and urgent help.</Text>

        <View style={[styles.card, { marginTop: 16 }]}> 
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Emergency support</Text>
          <Text style={{ color: colors.muted }}>If you need help during a ride, use the rest stops or contact a support center near you.</Text>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity key={contact.id} style={[styles.button, { marginTop: 10 }]} onPress={() => { void Linking.openURL(`tel:${contact.number}`); }}>
              <Text style={styles.buttonText}>{contact.label}: {contact.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
        ) : error ? (
          <View style={[styles.card, { marginTop: 20 }]}> 
            <Text style={{ color: colors.danger }}>{error}</Text>
          </View>
        ) : (
          <ScrollView style={{ marginTop: 20 }} contentContainerStyle={{ paddingBottom: 12 }}>
            {places.map((item) => (
              <View key={item.id} style={[styles.card, { marginBottom: 12 }]}> 
                <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.name}</Text>
                <Text style={{ color: colors.muted, marginTop: 6 }}>{item.type}</Text>
                <Text style={{ color: colors.muted, marginTop: 6 }}>{coords ? `${item.distanceKm.toFixed(1)} km away` : 'Distance unavailable (location off)'}</Text>
                <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={() => { void openRoute(item); }}>
                  <Text style={styles.buttonText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
