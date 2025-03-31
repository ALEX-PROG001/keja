import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ListingCard from "../components/ListingCard";
import { X } from "lucide-react";

export default function Mapexplore() {
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Listings
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

  // Initialize Map
  useEffect(() => {
    if (map) return;

    const initialMap = L.map("mapexplore").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(initialMap);

    setMap(initialMap);

    return () => {
      initialMap.remove();
    };
  }, []);

  // Add markers for listings
  useEffect(() => {
    if (!map || !listings.length) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);

          // User's location marker
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("Your location")
            .openPopup();

          // Add listing markers
          listings.forEach((listing) => {
            if (listing.location?.coordinates) {
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
                  <p style="color:#666; margin-bottom:4px;">KSH ${
                    listing.price || "N/A"
                  }/month</p>
                  <p style="color:#666; margin-bottom:8px;">${
                    listing.bedrooms
                  } Bedrooms</p>
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
        (error) => {
          console.error("Geolocation error:", error);
          setError("Could not get your location");
        }
      );
    }
  }, [map, listings]);

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <div id="mapexplore" className="h-full w-full" />
  
      {error && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          {error}
        </div>
      )}
  
      {loading && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          Loading listings...
        </div>
      )}
  
      {/* Centered ListingCard with Backdrop */}
      {selectedListing && (
        <>
          {/* Backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1999]"
            onClick={() => setSelectedListing(null)}
          />
          
          {/* Card Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[2000]">
            <div className="w-full max-w-md pointer-events-auto">
              <div className="relative bg-white rounded-xl shadow-2xl">
               {/* Close Button */}
<button
  onClick={() => setSelectedListing(null)}
  className="absolute -top-4 -right-4 z-[2001] p-2.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
>
  <X className="w-6 h-6 text-gray-800" />
</button>
                
                {/* ListingCard */}
                <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
                  <ListingCard 
                    listing={selectedListing}
                    deletable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}