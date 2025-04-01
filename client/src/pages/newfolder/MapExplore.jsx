import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ListingCard from "../../components/ListingCard";
import { X } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

export default function Mapexplore() {
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/getall", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Initialize Leaflet Map once when container exists
  useEffect(() => {
    if (map || !document.getElementById("mapexplore")) return;
    
    const initialMap = L.map("mapexplore").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(initialMap);
    
    setMap(initialMap);

    return () => {
      initialMap.remove();
    };
  }, [map]);

  // Center map on user's location and add markers for listings
  useEffect(() => {
    if (!map) return;

    // Remove existing markers (if any)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Detected location:", latitude, longitude);
          map.setView([latitude, longitude], 13);

          // User's location marker
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("Your location")
            .openPopup();

          // Add listing markers
          listings.forEach((listing) => {
            if (listing.location?.coordinates) {
              // Assuming listing.location.coordinates is [lng, lat]
              const [lng, lat] = listing.location.coordinates;
              const imageUrl =
                listing.imageUrls?.[0] || "https://via.placeholder.com/150";

              const popupContent = `
                <div class="text-center">
                  <img 
                    src="${imageUrl}" 
                    alt="${listing.name}" 
                    style="width:150px; height:150px; object-fit:cover; border-radius:8px; margin:0 auto 8px auto;"
                  />
                  <h3 style="font-weight:600; font-size:16px; margin-bottom:4px;">${listing.name}</h3>
                  <p style="color:#666; margin-bottom:4px;">KSH ${listing.price || "N/A"}/month</p>
                  <p style="color:#666; margin-bottom:8px;">${listing.bedrooms} Bedrooms</p>
                  <button 
                    class="view-details-btn bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                    data-listing-id="${listing._id}"
                  >
                    View Details
                  </button>
                </div>
              `;
              const marker = L.marker([lat, lng]).addTo(map);
              marker.bindPopup(popupContent);

              marker.on("popupopen", () => {
                setTimeout(() => {
                  const button = document.querySelector(
                    `.view-details-btn[data-listing-id="${listing._id}"]`
                  );
                  if (button) {
                    button.addEventListener("click", () => {
                      setSelectedListing(listing);
                      marker.closePopup();
                    });
                  }
                }, 100);
              });
            }
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Could not get your location");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, [map, listings]);

  return (
    <div className="relative h-screen w-screen">
      {/* Map container covering full viewport */}
      <div id="mapexplore" className="h-full w-full" />
      
      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          Loading listings...
        </div>
      )}

      {/* Modal for selected listing */}
      {selectedListing && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1999]"
            onClick={() => setSelectedListing(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[2000]">
            <div className="w-full max-w-md pointer-events-auto">
              <div className="relative bg-white rounded-xl shadow-2xl">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute -top-4 -right-4 z-[2001] p-2.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>
                <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
                  <ListingCard listing={selectedListing} deletable={false} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
