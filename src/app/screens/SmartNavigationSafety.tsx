import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Map, Navigation, AlertTriangle, CloudRain, Clock, Coffee, ShieldAlert, Search, MapPin, Loader2 } from 'lucide-react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const startIcon = L.divIcon({ className: 'ridesafe-map-marker', html: '<span class="ridesafe-map-marker-start">S</span>', iconSize: [30, 30], iconAnchor: [15, 15] });
const destinationIcon = L.divIcon({ className: 'ridesafe-map-marker', html: '<span class="ridesafe-map-marker-destination">D</span>', iconSize: [30, 30], iconAnchor: [15, 15] });

function RouteViewport({ route }: { route: any }) {
  const map = useMap();
  useEffect(() => {
    if (route?.geometry?.coordinates?.length) {
    const points = route.geometry.coordinates.map(([longitude, latitude]: [number, number]) => [latitude, longitude] as [number, number]);
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36] });
    }
  }, [map, route]);
  return null;
}

export default function SmartNavigationSafety() {
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPlaces = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Place search failed');
      const results = await response.json();
      setSuggestions(results);
      if (!results.length) setError('No places found. Try a city, address, or landmark.');
    } catch {
      setError('Unable to search places right now. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const startRoute = () => {
    if (!place) return;
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords.longitude},${coords.latitude};${place.lon},${place.lat}?overview=full&geometries=geojson`);
        if (!response.ok) throw new Error('Route request failed');
        const data = await response.json();
        if (!data.routes?.length) throw new Error('No route found');
        setRoute({ ...data.routes[0], origin: [coords.longitude, coords.latitude], destination: [Number(place.lon), Number(place.lat)] });
      } catch {
        setError('Unable to calculate a route to this place.');
      } finally {
        setLoading(false);
      }
    }, () => {
      setLoading(false);
      setError('Allow location access to calculate a route from your current position.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  return (
    <div className="min-h-screen p-6 pb-24 bg-background">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Smart Navigation</h1>
          <p className="text-muted-foreground text-sm">AI Route Safety Analysis</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
          <Navigation className="w-5 h-5 text-primary" />
        </div>
      </div>

      <Card className="mb-6 border-primary/20 bg-white/80 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={searchPlaces} className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Select a destination, address, or landmark" className="h-12 w-full rounded-xl border border-input bg-white pl-11 pr-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <Button type="submit" disabled={loading || !query.trim()} className="h-12 md:w-36">
              {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Search places'}
            </Button>
          </form>
          {suggestions.length > 0 && (
            <div className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
              {suggestions.map((suggestion) => (
                <button key={suggestion.place_id} type="button" onClick={() => { setPlace(suggestion); setSuggestions([]); setQuery(suggestion.display_name); }} className="flex w-full items-start gap-3 p-3 text-left hover:bg-primary/5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{suggestion.display_name}</span>
                </button>
              ))}
            </div>
          )}
          {place && <div className="mt-3 flex flex-col gap-3 rounded-xl bg-primary/5 p-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">Selected destination</p><p className="text-sm text-foreground">{place.display_name}</p></div><Button onClick={startRoute} disabled={loading} className="md:w-44">{loading ? 'Finding route...' : 'Start route'}</Button></div>}
          {route && <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground"><span><strong className="text-foreground">{(route.distance / 1000).toFixed(1)} km</strong> route</span><span><strong className="text-foreground">{Math.round(route.duration / 60)} min</strong> estimated drive</span></div>}
          {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
        </CardContent>
      </Card>

      <div className="relative z-0 aspect-square overflow-hidden rounded-3xl mb-6 border border-border shadow-sm md:aspect-video">
        {route ? (
          <MapContainer center={[route.origin[1], route.origin[0]]} zoom={13} scrollWheelZoom className="h-full w-full">
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={route.geometry.coordinates.map(([longitude, latitude]: [number, number]) => [latitude, longitude] as [number, number])} pathOptions={{ color: '#0ea5e9', weight: 6, opacity: 0.9 }} />
            <Marker position={[route.origin[1], route.origin[0]]} icon={startIcon} />
            <Marker position={[route.destination[1], route.destination[0]]} icon={destinationIcon} />
            <RouteViewport route={route} />
          </MapContainer>
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-center text-sm text-muted-foreground"><div><Map className="mx-auto mb-3 h-10 w-10 text-primary" /><p>Search for a destination to display the route.</p></div></div>
        )}

        {/* Hazard Points */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="absolute top-[30%] left-[30%] w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center border border-destructive"
        >
          <AlertTriangle className="w-4 h-4 text-destructive" />
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, delay: 0.5 }}
          className="absolute top-[60%] right-[20%] w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center border border-warning"
        >
          <CloudRain className="w-4 h-4 text-warning" />
        </motion.div>

        {/* Rest Stop Suggestion */}
        <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 glass-card p-3 rounded-xl border border-success/30 flex items-center gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Coffee className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Suggested Rest Stop</p>
            <p className="text-[10px] text-success">2.5 miles ahead</p>
          </div>
        </div>
        
        {/* Real-time stats HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
          <div className="bg-white/90 text-foreground backdrop-blur-md p-2 rounded-lg border border-border shadow">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm">{route ? `${Math.round(route.duration / 60)} min route` : 'Route preview'}</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-4">Route Risk Factors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { title: "High Accident Zone", desc: "Approaching intersection with high historical crash rate.", icon: ShieldAlert, color: "destructive" },
          { title: "Adverse Weather", desc: "Heavy rain reported 15 miles ahead. Reduced visibility.", icon: CloudRain, color: "warning" },
          { title: "Fatigue Warning", desc: "You've been driving for over 2 hours continuously.", icon: Clock, color: "primary" }
        ].map((risk, i) => (
          <Card key={i} className={`glass-card border-${risk.color}/30 bg-${risk.color}/5`}>
            <CardContent className="p-4 flex gap-4 items-start">
              <div className={`mt-1 w-10 h-10 rounded-full bg-${risk.color}/20 flex items-center justify-center shrink-0`}>
                <risk.icon className={`w-5 h-5 text-${risk.color}`} />
              </div>
              <div>
                <h4 className={`font-bold mb-1 text-${risk.color}`}>{risk.title}</h4>
                <p className="text-sm text-muted-foreground">{risk.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="glass-card p-6 rounded-2xl border-white/10 text-center">
        <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
        <p className="text-muted-foreground mb-6">
          Based on your current fatigue metrics and upcoming road hazards, we strongly suggest taking a 15-minute break at the next rest area.
        </p>
        <Button onClick={() => place ? startRoute() : document.querySelector<HTMLInputElement>('input')?.focus()} className="w-full bg-primary text-black font-bold rounded-xl h-12 hover:bg-primary/90 glow-primary">
          Route to Nearest Rest Stop
        </Button>
      </div>
    </div>
  );
}
