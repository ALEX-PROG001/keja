// geoHelper.js
import fetch from 'node-fetch';

export async function getAreaName(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  try {
    const response = await fetch(url, {
      headers: {
        // Nominatim requires a valid User-Agent header per their usage policy
        'User-Agent': 'YourAppName/1.0 (your-email@example.com)',
      },
    });
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    const data = await response.json();
    // Extract the town, city, suburb, or village from the address if available
    return (
      data.address.town ||
      data.address.city ||
      data.address.suburb ||
      data.address.village ||
      'Unknown'
    );
  } catch (error) {
    console.error('Error in getAreaName:', error);
    return 'Unknown';
  }
}
