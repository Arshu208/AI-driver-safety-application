import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, styles } from '../theme';
import { searchPlaces as searchPlacesApi } from '../services/navigation';

// Conditionally import location module only on native
let Location: any = null;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

export default function NavigationScreen() {
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        if (Platform.OS === 'web') {
          // On web, use browser geolocation API
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({
                  coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                });
                setLoading(false);
              },
              (error) => {
                console.warn('Web geolocation error:', error);
                setError('Location access is required for navigation.');
                setLoading(false);
              }
            );
          } else {
            setError('Geolocation not available in browser.');
            setLoading(false);
          }
          return;
        }

        const { status } = await Location?.requestForegroundPermissionsAsync?.();
        if (status !== 'granted') {
          setError('Location access is required for navigation.');
          return;
        }
        const current = await Location?.getCurrentPositionAsync?.({});
        setLocation(current);
      } catch (err) {
        setError('Unable to determine current location.');
      } finally {
        setLoading(false);
      }
    };
    void loadLocation();
  }, []);

  const searchPlaces = async () => {
    const nextQuery = query.trim();
    if (!nextQuery) {
      setError('Enter a destination name to search.');
      return;
    }

    try {
      setSearching(true);
      setError('');
      const response = await searchPlacesApi(nextQuery);
      const data = response.data?.places ?? [];
      const normalized = Array.isArray(data) ? data : [];
      setResults(normalized);
      if (normalized.length === 0) {
        setError('No places found. Try a different destination name.');
      }
    } catch (e) {
      console.warn('mobile: navigation search failed', e);
      setError('Search failed from backend API. Check backend connection.');
    } finally {
      setSearching(false);
    }
  };

  const openRoute = async () => {
    if (!selectedPlace) {
      Alert.alert('Select a destination', 'Search and select a place first.');
      return;
    }

    const destination = `${selectedPlace.lat},${selectedPlace.lon}`;
    const googleMapsUrl = location
      ? `https://www.google.com/maps/dir/?api=1&origin=${location.coords.latitude},${location.coords.longitude}&destination=${destination}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lon}`;
    const supported = await Linking.canOpenURL(googleMapsUrl);
    if (supported) {
      await Linking.openURL(googleMapsUrl);
      return;
    }
    if (location) {
      await Linking.openURL(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.coords.latitude}%2C${location.coords.longitude}%3B${destination}`);
      return;
    }
    await Linking.openURL(`https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lon}#map=14/${selectedPlace.lat}/${selectedPlace.lon}`);
  };

  const calculateDistance = (place: any) => {
    if (!location) return null;
    const R = 6371; // Earth's radius in km
    const dLat = ((parseFloat(place.lat) * Math.PI) / 180) - ((location.coords.latitude * Math.PI) / 180);
    const dLon = ((parseFloat(place.lon) * Math.PI) / 180) - ((location.coords.longitude * Math.PI) / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.coords.latitude * Math.PI) / 180) * Math.cos((parseFloat(place.lat) * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateDrivingTime = (distance: number) => {
    const avgSpeed = 50; // km/h
    const minutes = Math.round((distance / avgSpeed) * 60);
    return minutes;
  };

  const getRouteInfo = () => {
    if (!selectedPlace) return null;
    const distance = calculateDistance(selectedPlace);
    if (!distance) return null;
    const time = calculateDrivingTime(distance);
    return { distance: distance.toFixed(1), time };
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Smart Navigation</Text>
      <Text style={styles.subtitle}>AI Route Safety Analysis</Text>

      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 12 }}>Search Destination</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search location, city, or landmark"
          placeholderTextColor={colors.muted}
          style={[styles.input, { marginBottom: 12 }]}
          editable={!selectedPlace || results.length > 0}
        />
        <TouchableOpacity
          style={[styles.button, searching && { opacity: 0.6 }]}
          onPress={searchPlaces}
          disabled={searching}
        >
          <Text style={styles.buttonText}>{searching ? 'Searching...' : 'Search places'}</Text>
        </TouchableOpacity>

        {results.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>Results ({results.length})</Text>
            {results.map((item) => (
              <TouchableOpacity
                key={item.place_id}
                style={{
                  borderRadius: 8,
                  backgroundColor: colors.surface,
                  padding: 10,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => {
                  setSelectedPlace(item);
                  setResults([]);
                  setQuery(item.display_name);
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.ink }}>{item.display_name}</Text>
                <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>
                  {item.category} • {item.type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {selectedPlace && !results.length && (() => {
        const routeInfo = getRouteInfo();
        return (
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>SELECTED DESTINATION</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 12 }}>
            {selectedPlace.display_name}
          </Text>

          {routeInfo && (
            <View style={{ paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>
                {routeInfo.distance} km route
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                {routeInfo.time} min estimated drive
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, { marginBottom: 12 }]}
            onPress={openRoute}
          >
            <Text style={styles.buttonText}>Start route</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surface }}
            onPress={() => {
              setSelectedPlace(null);
              setResults([]);
              setQuery('');
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary, textAlign: 'center' }}>
              Search another place
            </Text>
          </TouchableOpacity>
        </View>
        );
      })()}

      {!selectedPlace && (
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>Current Location</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : error ? (
            <Text style={{ color: colors.danger, fontSize: 12 }}>{error}</Text>
          ) : location ? (
            <>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>
                {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
                📍 Search and select a destination to start your safe route.
              </Text>
            </>
          ) : null}
        </View>
      )}

      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 8 }}>Safety Tips</Text>
        <Text style={{ fontSize: 11, color: colors.muted, lineHeight: 18 }}>
          🚗 Keep your focus on the road ahead{'\n'}
          🛑 Take rest breaks when fatigue rises{'\n'}
          📱 Use safe navigation features only{'\n'}
          ⚠️ Follow traffic rules and speed limits
        </Text>
      </View>
    </ScrollView>
  );
}
