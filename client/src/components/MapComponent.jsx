import { useEffect, useRef, useState, useCallback } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from 'react-router-dom';
import ListingCard from "./ListingCard";
import "./MapComponent.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [showListingCard, setShowListingCard] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [searchParams] = useSearchParams();

  // Search states and filter options
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const bedroomOptions = ['Any', '1', '2', '3', '4', '5'];
  const priceRanges = [
    { label: 'Below 10k', value: '0-10000' },
    { label: '10k-15k', value: '10000-15000' },
    { label: '15k-20k', value: '15000-20000' },
    { label: '20k-25k', value: '20000-25000' },
    { label: 'Above 30k', value: '30000-above' }
  ];
  const propertyTypes = [
    'rentals', 'for-sale', 'bnbs', 'technicians', 'architects',
    'engineers', 'interior-designer', 'furniture'
  ];

  // Handle click outside filters
  const handleClickOutside = useCallback((event) => {
    if (filterRef.current && 
        !filterRef.current.contains(event.target) && 
        !filterButtonRef.current.contains(event.target)) {
      setShowFilters(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Initialize map and add user location
  useEffect(() => {
    if (!map) {
      const initialMap = L.map(mapRef.current, {
        center: [-1.2921, 36.8219],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors'
      }).addTo(initialMap);

      // Add user location with red pin
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const userLocationMarker = L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: '/red.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
              })
            }).addTo(initialMap);
            
            userLocationMarker.bindPopup("You are here").openPopup();
            setUserMarker(userLocationMarker);
          },
          (error) => console.error("Error getting location:", error)
        );
      }

      setMap(initialMap);
    }

    return () => {
      map?.remove();
      userMarker?.remove();
    };
  }, []);

  // Handle URL parameters and selected listing
  useEffect(() => {
    const selectedId = searchParams.get('selectedId');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (selectedId) {
      setSelectedListingId(selectedId);
    }

    if (map && lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [searchParams, map]);

  // Fetch and display listings
  useEffect(() => {
    if (!map) return;

    markers.forEach(marker => marker.remove());

    const fetchListings = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (propertyType) params.append('type', propertyType);
        if (bedrooms && bedrooms !== 'Any') params.append('bedrooms', bedrooms);
        if (priceRange) {
          const [min, max] = priceRange.split('-');
          if (min) params.append('minPrice', min);
          if (max && max !== 'above') params.append('maxPrice', max);
        }

        const response = await fetch('/api/listing/search?' + params.toString());
        const data = await response.json();

        const newMarkers = data.listings.map(listing => {
          if (listing.location?.coordinates) {
            const [lng, lat] = listing.location.coordinates;
            const isSelected = listing._id === selectedListingId;
            const isRedirected = isSelected && searchParams.get('redirected') === 'true';

            const marker = L.marker([lat, lng], {
              icon: L.icon({
                iconUrl: isRedirected ? '/black.png' : '/blue.png', // Only black for redirected, blue for all others
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
              })
            }).addTo(map);

            marker.bindPopup(`
              <div class="listing-popup">
                <div class="image-wrapper">
                  <img src="${listing.imageUrls?.[0] || 'https://via.placeholder.com/150'}" 
                       alt="${listing.name}" 
                       class="property-image"/>
                  <div class="image-overlay">
                    <p class="property-price">KES ${listing.price || 'N/A'}</p>
                  </div>
                </div>
                <div class="content-wrapper">
                  <p class="property-details">${listing.bedrooms || '0'} Bed • ${listing.type || ''}</p>
                  <button id="viewMore-${listing._id}" class="view-more-btn">
                    View Details
                  </button>
                </div>
              </div>
            `);

            marker.on('popupopen', () => {
              const button = document.getElementById(`viewMore-${listing._id}`);
              if (button) {
                button.addEventListener('click', () => {
                  setSelectedListing(listing);
                  setShowListingCard(true);
                });
              }
            });

            if (isSelected) {
              marker.openPopup();
            }

            return marker;
          }
          return null;
        }).filter(Boolean);

        setMarkers(newMarkers);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [map, searchTerm, propertyType, bedrooms, priceRange, selectedListingId, searchParams]);

  return (
    <div className="relative h-screen w-full">
      <div
        ref={mapRef}
        className="map-container"
        style={{
          height: "calc(100vh - 160px)",
          borderRadius: "20px",
          zIndex: 10,
        }}
      />

      <button
        ref={filterButtonRef}
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-4 right-4 z-[1000] p-3 bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center transition hover:bg-opacity-100"
      >
        <SlidersHorizontal className="h-6 w-6 text-gray-700" />
      </button>

      {showFilters && (
        <div
          ref={filterRef}
          className="absolute top-0 left-0 w-full p-4 bg-white shadow-lg rounded-b-lg z-[1000]"
        >
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings..."
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
            <SearchIcon className="absolute right-8 text-gray-600 pointer-events-none" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full p-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            >
              <option value="">Type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>

            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full p-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            >
              <option value="">Beds</option>
              {bedroomOptions.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full p-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            >
              <option value="">Price</option>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showListingCard && selectedListing && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 z-[2000]">
          <button
            onClick={() => setShowListingCard(false)}
            className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-900 transition"
          >
            ✕
          </button>
          <ListingCard listing={selectedListing} />
        </div>
      )}
    </div>
  );
};

export default MapComponent;