import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);

  return null;
}

MapController.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  })
};

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

LocationMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  setPosition: PropTypes.func.isRequired
};

export default function MapSelect({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const intervalRef = useRef(null);

  const updateLocation = async () => {
    try {
      if (!navigator.geolocation) throw new Error('Geolocation not supported');

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      setPosition(coords);
      onLocationSelect(coords);
    } catch (err) {
      console.warn('Live location failed, trying last known:', err);

      try {
        const lastKnown = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 3000,
            maximumAge: Infinity
          });
        });

        const coords = {
          lat: lastKnown.coords.latitude,
          lng: lastKnown.coords.longitude
        };

        setPosition(coords);
        onLocationSelect(coords);
      } catch (fallbackErr) {
        console.error('Last known location also failed:', fallbackErr);
        setError('Could not get your location, using default');
        const defaultCoords = { lat: -1.2921, lng: 36.8219 };
        setPosition(defaultCoords);
        onLocationSelect(defaultCoords);
      }
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    await updateLocation();
    setLoading(false);
  };

  useEffect(() => {
    setMapReady(true);
    getCurrentLocation();

    // Start location polling every 10 seconds
    intervalRef.current = setInterval(updateLocation, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSetPosition = (pos) => {
    setPosition(pos);
    onLocationSelect(pos);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={loading}
        className="w-full p-3 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 disabled:opacity-50"
      >
        {loading ? 'Getting Location...' : 'Set Current Location'}
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <p className="text-center text-gray-500 text-sm">- or pick from map -</p>

      <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-gray-300">
        {mapReady && (
          <MapContainer
            center={position ? [position.lat, position.lng] : [-1.2921, 36.8219]}
            zoom={16}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={handleSetPosition} />
            <MapController position={position} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}

MapSelect.propTypes = {
  onLocationSelect: PropTypes.func.isRequired
};
