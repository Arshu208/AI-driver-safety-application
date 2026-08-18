import { Router, Request, Response } from 'express';

const router = Router();

const fallbackPlaces = [
  { place_id: 'fallback-1', display_name: 'Marina Beach, Chennai', lat: '13.0500', lon: '80.2824' },
  { place_id: 'fallback-2', display_name: 'Anna Nagar, Chennai', lat: '13.0878', lon: '80.2097' },
  { place_id: 'fallback-3', display_name: 'T. Nagar, Chennai', lat: '13.0419', lon: '80.2337' },
  { place_id: 'fallback-4', display_name: 'Hospital Zone, Chennai', lat: '13.0604', lon: '80.2489' },
  { place_id: 'fallback-5', display_name: 'Fuel Station, Chennai', lat: '13.0454', lon: '80.1959' },
];

const makeNearbyFallback = (lat: number, lon: number) => {
  return fallbackPlaces.map((place, index) => {
    const placeLat = Number(place.lat);
    const placeLon = Number(place.lon);
    const dLat = placeLat - lat;
    const dLon = placeLon - lon;
    const distanceKm = Math.sqrt((dLat * 111) ** 2 + (dLon * 111) ** 2);

    return {
      place_id: `${place.place_id}-${index}`,
      display_name: place.display_name,
      lat: place.lat,
      lon: place.lon,
      distanceKm,
    };
  }).filter((place) => Number.isFinite(place.distanceKm) && place.distanceKm < 100).sort((a, b) => a.distanceKm - b.distanceKm);
};

router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      res.status(400).json({ error: 'q query parameter is required' });
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&q=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'RideSafe/1.0 (navigation-search)' },
      });

      if (!response.ok) {
        throw new Error('provider failed');
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        res.json({ places: data });
        return;
      }
    } catch {
      // Fall through to safe built-in fallback data.
    }

    const safeMatches = fallbackPlaces
      .filter((place) => place.display_name.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(place.display_name.split(',')[0].toLowerCase()))
      .slice(0, 5);

    res.json({ places: safeMatches.length > 0 ? safeMatches : fallbackPlaces.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search places' });
  }
});

router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const query = String(req.query.q || 'rest stop fuel station hospital emergency').trim();

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      res.status(400).json({ error: 'lat and lon query parameters are required' });
      return;
    }

    try {
      const boundedUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&q=${encodeURIComponent(query)}&viewbox=${lon - 0.5},${lat + 0.5},${lon + 0.5},${lat - 0.5}&bounded=1`;
      const response = await fetch(boundedUrl, {
        headers: { 'User-Agent': 'RideSafe/1.0 (navigation-nearby)' },
      });

      if (response.ok) {
        const data = await response.json();
        const places = (Array.isArray(data) ? data : []).map((item: any) => {
          const itemLat = Number(item.lat);
          const itemLon = Number(item.lon);
          const dLat = itemLat - lat;
          const dLon = itemLon - lon;
          const distanceKm = Math.sqrt((dLat * 111) ** 2 + (dLon * 111) ** 2);

          return {
            place_id: item.place_id,
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
            distanceKm,
          };
        });

        const filtered = places
          .filter((item: any) => Number.isFinite(item.distanceKm) && item.distanceKm < 100)
          .sort((a: any, b: any) => a.distanceKm - b.distanceKm);

        if (filtered.length > 0) {
          res.json({ places: filtered });
          return;
        }
      }
    } catch {
      // Fall through to safe built-in fallback data.
    }

    const fallback = makeNearbyFallback(lat, lon);
    res.json({ places: fallback.length > 0 ? fallback : makeNearbyFallback(13.0524, 80.2508) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
});

router.get('/emergency', async (_req: Request, res: Response) => {
  res.json({
    contacts: [
      { id: '1', label: 'National Emergency', number: '112' },
      { id: '2', label: 'Ambulance', number: '108' },
      { id: '3', label: 'Police', number: '100' },
    ],
  });
});

export default router;
