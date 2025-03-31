import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Mapexplore() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize the map with a default view
    const initialMap = L.map("mapexplore").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(initialMap);
    setMap(initialMap);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Center map on user's location
          initialMap.setView([latitude, longitude], 13, { animate: true });
          // Add a marker for the user
          L.marker([latitude, longitude])
            .addTo(initialMap)
            .bindPopup("You are here")
            .openPopup();

          // Fetch listings from the database
          fetch("http://localhost:3000/api/listing/getall")
            .then((res) => res.json())
            .then((listings) => {
              listings.forEach((listing) => {
                // Ensure listing has valid GeoJSON location data
                if (listing.location && listing.location.coordinates) {
                  const [lng, lat] = listing.location.coordinates; // [longitude, latitude]
                  // Use first image if available, else a placeholder image
                  const imageUrl =
                    listing.imageUrls && listing.imageUrls[0]
                      ? listing.imageUrls[0]
                      : "https://via.placeholder.com/150";
                  const popupContent = `
                    <div style="text-align: center;">
                      <img src="${imageUrl}" alt="${listing.name}" style="width:100px; height:auto; margin-bottom:8px;" />
                      <p><strong>${listing.name}</strong></p>
                      <p><strong>Price:</strong> ${listing.price || "N/A"}</p>
                      <p><strong>Bedrooms:</strong> ${listing.bedrooms || "N/A"}</p>
                    </div>
                  `;
                  L.marker([lat, lng])
                    .addTo(initialMap)
                    .bindPopup(popupContent);
                }
              });
            })
            .catch((error) => {
              console.error("Error fetching listings:", error);
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          initialMap.setView([0, 0], 2);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Cleanup on component unmount
    return () => {
      initialMap.remove();
    };
  }, []);

  return (
    <div style={{ height: "75vh", width: "100%" }}>
      <div id="mapexplore" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}
