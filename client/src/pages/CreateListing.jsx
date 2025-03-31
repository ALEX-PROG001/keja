import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MapSelect from "../components/MapSelect";
import UploadPage from "./UploadPage";

const PROPERTY_TYPES = [
  "rentals", "for-sale", "bnbs", "technicians", 
  "architects", "engineers", "interior-designer", "furniture"
];

const SERVICE_TYPES = ["technicians", "architects", "engineers", "interior-designer", "furniture"];

const BEDROOM_OPTIONS = [
  "single-room", "double-room", "bedsitter", 
  "1-bedroom", "2-bedroom", "3-bedroom", "more-than-3-bedrooms"
];

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  phoneNumber: "",
  price: "",
  bedrooms: "",
  type: "rentals",
  furnished: false,
  parking: false,
  imageUrls: [],
  location: "",
};

export default function CreateListing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  // Check if we're in edit mode (data passed via location.state)
  const initialData = location.state?.listing || INITIAL_FORM_STATE;
  const [formData, setFormData] = useState(initialData);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isServiceListing = SERVICE_TYPES.includes(formData.type);
  
  // We're in edit mode if an _id exists on the listing
  const isEditMode = !!formData._id;

  useEffect(() => {
    if (location.state?.listing) {
      setFormData(location.state.listing);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleLocationSelect = (coords) => {
    setCoordinates(coords);
    setFormData(prev => ({
      ...prev,
      location: `${coords.lat},${coords.lng}`
    }));
  };

  // Update imageUrls completely based on final selection from UploadPage
  const handleImageUpload = (finalUrls) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: finalUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting Form Data:", formData);
      
      // Use POST for both create and update (update endpoint uses POST)
      const endpoint = isEditMode 
        ? `http://localhost:3000/api/listing/update/${formData._id}` 
        : "http://localhost:3000/api/listing/create";
      const method = "POST";
      
      const res = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          // Uncomment the following if your backend requires an Authorization header:
          // "Authorization": `Bearer ${currentUser.token}`,
        },
        credentials: "include", // include cookies if using cookie-based auth
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      
      const data = await res.json();
      console.log("Server Response:", data);
      setLoading(false);

      if (!res.ok) {
        setError(data.message || (isEditMode ? "Failed to update listing" : "Failed to create listing"));
        return;
      }

      alert(isEditMode ? "Listing updated successfully!" : "Listing created successfully!");
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          {isEditMode ? "Update a Listing" : "Create a Listing"}
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block font-semibold">Type</label>
          <select id="type" value={formData.type} onChange={handleChange} className="w-full p-3 bg-gray-200 rounded-lg">
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type.replace(/-/g, " ")}</option>
            ))}
          </select>

          {!isServiceListing && (
            <>
              <label className="block font-semibold">Bedrooms</label>
              <select id="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-3 bg-gray-200 rounded-lg" required>
                <option value="">Select number of bedrooms</option>
                {BEDROOM_OPTIONS.map(option => (
                  <option key={option} value={option}>{option.replace(/-/g, " ")}</option>
                ))}
              </select>
            </>
          )}

          {Object.keys(INITIAL_FORM_STATE)
            .filter(field => !["type", "bedrooms", "furnished", "parking", "imageUrls", "location"].includes(field))
            .map(field => (
              <div key={field}>
                <label className="block font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input 
                  id={field} 
                  type="text" 
                  value={formData[field]} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-gray-200 rounded-lg" 
                  required 
                />
              </div>
          ))}

          {[
            { id: "parking", label: "Parking" },
            { id: "furnished", label: "Furnished" }
          ].map(({ id, label }) => (
            <label key={id} className="flex items-center space-x-2">
              <input type="checkbox" id={id} checked={formData[id]} onChange={handleChange} />
              <span>{label}</span>
            </label>
          ))}

          <MapSelect onLocationSelect={handleLocationSelect} />
          {coordinates && (
            <div className="mt-2 p-2 bg-gray-200 rounded-lg">
              Selected Coordinates: {coordinates.lat}, {coordinates.lng}
            </div>
          )}

          {/* Pass existing images in edit mode */}
          <UploadPage 
            initialImages={isEditMode ? formData.imageUrls : []} 
            onUploadComplete={handleImageUpload} 
          />

          {/* Extra bottom margin to avoid collision with bottom nav */}
          <button 
            type="submit" 
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-16" 
            disabled={loading}
          >
            {loading 
              ? (isEditMode ? "Updating..." : "Creating...") 
              : (isEditMode ? "Update Listing" : "Create Listing")
            }
          </button>
        </form>
      </div>
    </div>
  );
}
