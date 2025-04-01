import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MapSelect from "../components/MapSelect";
import UploadPage from "./newfolder/UploadPage";

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

export default function UpdateListing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [formData, setFormData] = useState(location.state?.listing || INITIAL_FORM_STATE);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isServiceListing = SERVICE_TYPES.includes(formData.type);
  const { listingId } = useParams(); // Get listing ID from URL

  useEffect(() => {
    console.log("Received Listing Data:", location.state);
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

  const handleImageUpload = (uploadedUrls) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...new Set([...prev.imageUrls, ...uploadedUrls])]
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
      console.log("Submitting Update Data:", formData);
      const res = await fetch(`/api/listing/update/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      console.log("Server Response:", data);
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Failed to update listing");
        return;
      }

      alert("Listing updated successfully!");
      navigate(`/listing/${formData._id}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Update Listing</h2>
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

          {Object.keys(INITIAL_FORM_STATE).filter(field => !["type", "bedrooms", "furnished", "parking", "imageUrls", "location"].includes(field)).map(field => (
            <div key={field}>
              <label className="block font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input id={field} type="text" value={formData[field]} onChange={handleChange} className="w-full p-3 bg-gray-200 rounded-lg" required />
            </div>
          ))}

          {[{ id: "parking", label: "Parking" }, { id: "furnished", label: "Furnished" }].map(({ id, label }) => (
            <label key={id} className="flex items-center space-x-2">
              <input type="checkbox" id={id} checked={formData[id]} onChange={handleChange} />
              <span>{label}</span>
            </label>
          ))}

          <MapSelect onLocationSelect={handleLocationSelect} />
          {coordinates && <div className="mt-2 p-2 bg-gray-200 rounded-lg">Selected Coordinates: {coordinates.lat}, {coordinates.lng}</div>}

          <UploadPage onUploadComplete={handleImageUpload} />
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors" disabled={loading}>
            {loading ? "Updating..." : "Update Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
