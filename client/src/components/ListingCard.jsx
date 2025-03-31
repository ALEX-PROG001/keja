import { useState } from 'react';
import { MapPin, Bookmark, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ListingCard({ listing, deletable, onDelete }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);

  // State for saved (bookmark) functionality
  const [bookmarked, setBookmarked] = useState(false);
  const [savedCount, setSavedCount] = useState(listing.savedCount || 0);

  // Carousel swipe handlers
  const handleTouchStart = (e) => setTouchStartX(e.changedTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEndX(e.changedTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < listing.imageUrls.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Full-screen swipe handlers
  const handleFullScreenTouchStart = (e) => setTouchStartX(e.changedTouches[0].clientX);
  const handleFullScreenTouchMove = (e) => setTouchEndX(e.changedTouches[0].clientX);
  const handleFullScreenTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && fullScreenIndex < listing.imageUrls.length - 1) {
        setFullScreenIndex(fullScreenIndex + 1);
      } else if (diff < 0 && fullScreenIndex > 0) {
        setFullScreenIndex(fullScreenIndex - 1);
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleBookmark = async () => {
    try {
      if (!bookmarked) {
        // Save listing API call
        const res = await fetch(`http://localhost:3000/api/savedListing/listing/save/${listing._id}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (data.success) {
          setSavedCount(data.savedCount);
          setBookmarked(true);
        } else {
          console.error(data.message);
        }
      } else {
        // Unsave listing API call
        const res = await fetch(`http://localhost:3000/api/savedListing/listing/save/${listing._id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (data.success) {
          setSavedCount(data.savedCount);
          setBookmarked(false);
        } else {
          console.error(data.message);
        }
      }
    } catch (error) {
      console.error('Error updating saved listing:', error);
    }
  };

  // New: Pin button handler navigates to Mapexplore with listing's coordinates
  const handlePinClick = () => {
    if (listing.location && listing.location.coordinates) {
      const [lng, lat] = listing.location.coordinates;
      navigate(`/mapexplore?lat=${lat}&lng=${lng}`);
    } else {
      console.error("Listing location not available.");
    }
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative">
        <div
          className="relative h-52 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Image */}
          <img
            src={listing.imageUrls[currentImageIndex]}
            alt={listing.name}
            className="w-full h-full object-cover rounded-t-lg transition-opacity duration-500"
            onClick={() => {
              setFullScreenIndex(currentImageIndex);
              setFullScreenOpen(true);
            }}
          />
          {/* Image Indicator Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {listing.imageUrls.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full cursor-pointer ${idx === currentImageIndex ? "bg-white" : "bg-gray-400"}`}
              ></span>
            ))}
          </div>

          {/* Overlay Controls in Top-Right */}
          <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
            {/* Type Display with glass-morphic background */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg px-2 py-1 text-xs">
              {listing.type}
            </div>
            {/* Pin Button */}
            <button onClick={handlePinClick} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-lg border border-white/30">
              <MapPin className="w-4 h-4" stroke="white" fill="none" />
            </button>
            {/* Bookmark Button with Count */}
            <div className="flex flex-col items-center">
              <button onClick={handleBookmark} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-lg border border-white/30">
                <Bookmark className="w-4 h-4" stroke="white" fill="none" />
              </button>
              <span className="text-xs text-white mt-0.5">{savedCount}</span>
            </div>
          </div>

          {/* Delete (Unsave) Button for Saved Listings at Bottom-Left */}
          {deletable && (
            <button
              onClick={() => onDelete(listing._id)}
              className="absolute bottom-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-lg border border-white/30"
            >
              <Trash className="w-4 h-4" stroke="white" fill="none" />
            </button>
          )}
        </div>
        {/* Info Section */}
        <div className="p-2 bg-gray-200 rounded-b-lg text-sm">
          <div className="flex justify-between items-center">
            <div className="flex flex-col flex-1">
              {/* Name and Price Row */}
              <div className="flex justify-between items-center">
                <p className="font-bold">{listing.name}</p>
                {listing.price && (
                  <p className="font-medium text-sm">{`KSH ${listing.price}/month`}</p>
                )}
              </div>
              <p>{listing.bedrooms} Bedrooms</p>
              {listing.areaName && <p className="text-xs text-gray-600">{listing.areaName}</p>}
            </div>
            <button onClick={() => setExpanded(!expanded)}>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {expanded && (
            <div className="mt-2 space-y-1 transition-all duration-300">
              {listing.description && <p><strong>Description:</strong> {listing.description}</p>}
              {listing.phoneNumber && <p><strong>Phone:</strong> {listing.phoneNumber}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Full-screen modal for image display */}
      {fullScreenOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenOpen(false);
            }}
          >
            &times;
          </button>
          <div
            className="w-full h-full flex items-center justify-center relative"
            onTouchStart={handleFullScreenTouchStart}
            onTouchMove={handleFullScreenTouchMove}
            onTouchEnd={handleFullScreenTouchEnd}
          >
            <img
              src={listing.imageUrls[fullScreenIndex]}
              alt={listing.name}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-1">
              {listing.imageUrls.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setFullScreenIndex(idx)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${idx === fullScreenIndex ? "bg-white" : "bg-gray-500"}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
