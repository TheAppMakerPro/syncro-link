/**
 * Approximate coordinates for map placement when users don't enter lat/lng.
 * Tries city first, then falls back to country center.
 */

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // US Cities
  "san antonio": { lat: 29.4241, lng: -98.4936 },
  "new york": { lat: 40.7128, lng: -74.006 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "chicago": { lat: 41.8781, lng: -87.6298 },
  "houston": { lat: 29.7604, lng: -95.3698 },
  "phoenix": { lat: 33.4484, lng: -112.074 },
  "philadelphia": { lat: 39.9526, lng: -75.1652 },
  "san diego": { lat: 32.7157, lng: -117.1611 },
  "dallas": { lat: 32.7767, lng: -96.797 },
  "austin": { lat: 30.2672, lng: -97.7431 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  "seattle": { lat: 47.6062, lng: -122.3321 },
  "denver": { lat: 39.7392, lng: -104.9903 },
  "boston": { lat: 42.3601, lng: -71.0589 },
  "nashville": { lat: 36.1627, lng: -86.7816 },
  "portland": { lat: 45.5152, lng: -122.6784 },
  "las vegas": { lat: 36.1699, lng: -115.1398 },
  "miami": { lat: 25.7617, lng: -80.1918 },
  "atlanta": { lat: 33.749, lng: -84.388 },
  "orlando": { lat: 28.5383, lng: -81.3792 },
  "minneapolis": { lat: 44.9778, lng: -93.265 },
  "detroit": { lat: 42.3314, lng: -83.0458 },
  "charlotte": { lat: 35.2271, lng: -80.8431 },
  "tampa": { lat: 27.9506, lng: -82.4572 },
  "pittsburgh": { lat: 40.4406, lng: -79.9959 },
  "st. louis": { lat: 38.627, lng: -90.1994 },
  "salt lake city": { lat: 40.7608, lng: -111.891 },
  "honolulu": { lat: 21.3069, lng: -157.8583 },
  "anchorage": { lat: 61.2181, lng: -149.9003 },
  "indianapolis": { lat: 39.7684, lng: -86.1581 },
  "columbus": { lat: 39.9612, lng: -82.9988 },
  "jacksonville": { lat: 30.3322, lng: -81.6557 },
  "fort worth": { lat: 32.7555, lng: -97.3308 },
  "raleigh": { lat: 35.7796, lng: -78.6382 },
  "tucson": { lat: 32.2226, lng: -110.9747 },
  "el paso": { lat: 31.7619, lng: -106.485 },
  "albuquerque": { lat: 35.0844, lng: -106.6504 },
  "sacramento": { lat: 38.5816, lng: -121.4944 },
  "kansas city": { lat: 39.0997, lng: -94.5786 },
  "new orleans": { lat: 29.9511, lng: -90.0715 },

  // Canada
  "toronto": { lat: 43.6532, lng: -79.3832 },
  "vancouver": { lat: 49.2827, lng: -123.1207 },
  "montreal": { lat: 45.5017, lng: -73.5673 },
  "calgary": { lat: 51.0447, lng: -114.0719 },
  "ottawa": { lat: 45.4215, lng: -75.6972 },
  "edmonton": { lat: 53.5461, lng: -113.4938 },

  // UK
  "london": { lat: 51.5074, lng: -0.1278 },
  "manchester": { lat: 53.4808, lng: -2.2426 },
  "birmingham": { lat: 52.4862, lng: -1.8904 },
  "edinburgh": { lat: 55.9533, lng: -3.1883 },
  "glasgow": { lat: 55.8642, lng: -4.2518 },
  "bristol": { lat: 51.4545, lng: -2.5879 },
  "liverpool": { lat: 53.4084, lng: -2.9916 },

  // Europe
  "paris": { lat: 48.8566, lng: 2.3522 },
  "berlin": { lat: 52.52, lng: 13.405 },
  "madrid": { lat: 40.4168, lng: -3.7038 },
  "rome": { lat: 41.9028, lng: 12.4964 },
  "amsterdam": { lat: 52.3676, lng: 4.9041 },
  "barcelona": { lat: 41.3874, lng: 2.1686 },
  "lisbon": { lat: 38.7223, lng: -9.1393 },
  "vienna": { lat: 48.2082, lng: 16.3738 },
  "prague": { lat: 50.0755, lng: 14.4378 },
  "dublin": { lat: 53.3498, lng: -6.2603 },
  "stockholm": { lat: 59.3293, lng: 18.0686 },
  "copenhagen": { lat: 55.6761, lng: 12.5683 },
  "zurich": { lat: 47.3769, lng: 8.5417 },
  "munich": { lat: 48.1351, lng: 11.582 },
  "brussels": { lat: 50.8503, lng: 4.3517 },

  // Australia
  "sydney": { lat: -33.8688, lng: 151.2093 },
  "melbourne": { lat: -37.8136, lng: 144.9631 },
  "brisbane": { lat: -27.4698, lng: 153.0251 },
  "perth": { lat: -31.9505, lng: 115.8605 },
  "auckland": { lat: -36.8485, lng: 174.7633 },

  // Asia
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "mumbai": { lat: 19.076, lng: 72.8777 },
  "delhi": { lat: 28.7041, lng: 77.1025 },
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  "singapore": { lat: 1.3521, lng: 103.8198 },
  "bangkok": { lat: 13.7563, lng: 100.5018 },
  "seoul": { lat: 37.5665, lng: 126.978 },
  "shanghai": { lat: 31.2304, lng: 121.4737 },
  "beijing": { lat: 39.9042, lng: 116.4074 },
  "hong kong": { lat: 22.3193, lng: 114.1694 },

  // Latin America
  "mexico city": { lat: 19.4326, lng: -99.1332 },
  "são paulo": { lat: -23.5505, lng: -46.6333 },
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
  "buenos aires": { lat: -34.6037, lng: -58.3816 },
  "bogota": { lat: 4.711, lng: -74.0721 },
  "lima": { lat: -12.0464, lng: -77.0428 },
  "santiago": { lat: -33.4489, lng: -70.6693 },

  // Africa / Middle East
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "johannesburg": { lat: -26.2041, lng: 28.0473 },
  "cairo": { lat: 30.0444, lng: 31.2357 },
  "nairobi": { lat: -1.2921, lng: 36.8219 },
  "lagos": { lat: 6.5244, lng: 3.3792 },
  "dubai": { lat: 25.2048, lng: 55.2708 },
  "tel aviv": { lat: 32.0853, lng: 34.7818 },
  "istanbul": { lat: 41.0082, lng: 28.9784 },
};

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  "United States": { lat: 39.8, lng: -98.6 },
  "Canada": { lat: 56.1, lng: -106.3 },
  "Mexico": { lat: 23.6, lng: -102.6 },
  "Costa Rica": { lat: 9.7, lng: -83.8 },
  "Cuba": { lat: 21.5, lng: -79.0 },
  "Guatemala": { lat: 15.8, lng: -90.2 },
  "Jamaica": { lat: 18.1, lng: -77.3 },
  "Panama": { lat: 8.5, lng: -80.8 },
  "Argentina": { lat: -38.4, lng: -63.6 },
  "Brazil": { lat: -14.2, lng: -51.9 },
  "Chile": { lat: -35.7, lng: -71.5 },
  "Colombia": { lat: 4.6, lng: -74.1 },
  "Peru": { lat: -9.2, lng: -75.0 },
  "Venezuela": { lat: 6.4, lng: -66.6 },
  "United Kingdom": { lat: 55.4, lng: -3.4 },
  "France": { lat: 46.6, lng: 2.2 },
  "Germany": { lat: 51.2, lng: 10.5 },
  "Italy": { lat: 41.9, lng: 12.6 },
  "Spain": { lat: 40.5, lng: -3.7 },
  "Portugal": { lat: 39.4, lng: -8.2 },
  "Netherlands": { lat: 52.1, lng: 5.3 },
  "Belgium": { lat: 50.5, lng: 4.5 },
  "Switzerland": { lat: 46.8, lng: 8.2 },
  "Austria": { lat: 47.5, lng: 14.6 },
  "Sweden": { lat: 60.1, lng: 18.6 },
  "Norway": { lat: 60.5, lng: 8.5 },
  "Denmark": { lat: 56.3, lng: 9.5 },
  "Finland": { lat: 61.9, lng: 25.7 },
  "Poland": { lat: 51.9, lng: 19.1 },
  "Ireland": { lat: 53.1, lng: -7.7 },
  "Czech Republic": { lat: 49.8, lng: 15.5 },
  "Romania": { lat: 45.9, lng: 25.0 },
  "Greece": { lat: 39.1, lng: 21.8 },
  "Ukraine": { lat: 48.4, lng: 31.2 },
  "China": { lat: 35.9, lng: 104.2 },
  "Japan": { lat: 36.2, lng: 138.3 },
  "South Korea": { lat: 35.9, lng: 127.8 },
  "India": { lat: 20.6, lng: 79.0 },
  "Indonesia": { lat: -0.8, lng: 113.9 },
  "Thailand": { lat: 15.9, lng: 100.9 },
  "Vietnam": { lat: 14.1, lng: 108.3 },
  "Philippines": { lat: 12.9, lng: 121.8 },
  "Malaysia": { lat: 4.2, lng: 101.9 },
  "Singapore": { lat: 1.4, lng: 103.8 },
  "Pakistan": { lat: 30.4, lng: 69.3 },
  "Bangladesh": { lat: 23.7, lng: 90.4 },
  "Turkey": { lat: 39.0, lng: 35.2 },
  "Israel": { lat: 31.0, lng: 34.9 },
  "Saudi Arabia": { lat: 23.9, lng: 45.1 },
  "United Arab Emirates": { lat: 23.4, lng: 53.8 },
  "South Africa": { lat: -30.6, lng: 22.9 },
  "Nigeria": { lat: 9.1, lng: 8.7 },
  "Egypt": { lat: 26.8, lng: 30.8 },
  "Kenya": { lat: -0.02, lng: 37.9 },
  "Morocco": { lat: 31.8, lng: -7.1 },
  "Ghana": { lat: 7.9, lng: -1.0 },
  "Ethiopia": { lat: 9.1, lng: 40.5 },
  "Tanzania": { lat: -6.4, lng: 34.9 },
  "Australia": { lat: -25.3, lng: 133.8 },
  "New Zealand": { lat: -40.9, lng: 174.9 },
  "Russia": { lat: 61.5, lng: 105.3 },
  "Iceland": { lat: 65.0, lng: -19.0 },
};

/**
 * Small random offset so multiple users don't stack on the same pin.
 * ~0.05 degrees ≈ 5km for city, ~1 degree ≈ 100km for country.
 */
function jitter(scale: number = 1): number {
  return (Math.random() - 0.5) * 2 * scale;
}

export interface ApproxCoords {
  latitude: number;
  longitude: number;
  isApproximate: boolean;
}

/**
 * Return approximate coordinates for a user based on city and/or country.
 * Tries city first (tight jitter), then country (wider jitter).
 */
export function getApproxCoords(country: string, city?: string): ApproxCoords | null {
  // Try city lookup first
  if (city) {
    const cityKey = city.toLowerCase().trim();
    const cityEntry = CITY_COORDS[cityKey];
    if (cityEntry) {
      return {
        latitude: cityEntry.lat + jitter(0.05),
        longitude: cityEntry.lng + jitter(0.05),
        isApproximate: true,
      };
    }
  }

  // Fall back to country center
  const countryEntry = COUNTRY_COORDS[country];
  if (!countryEntry) return null;

  return {
    latitude: countryEntry.lat + jitter(1),
    longitude: countryEntry.lng + jitter(1),
    isApproximate: true,
  };
}
