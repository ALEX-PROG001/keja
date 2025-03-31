import { useState } from 'react';
import { 
  MapPin, 
  Bookmark, 
  Trash, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ListingCard({ listing, deletable, onDelete }) {
  const navigate = useNavigate();
  
  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [savedCount, setSavedCount] = useState(listing.savedCount || 0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Touch handlers for image carousel
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

  // Fullscreen image navigation
  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (fullScreenIndex > 0) {
      setFullScreenIndex(fullScreenIndex - 1);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (fullScreenIndex < listing.imageUrls.length - 1) {
      setFullScreenIndex(fullScreenIndex + 1);
    }
  };

  // Handle bookmark/save functionality
  const handleBookmark = async () => {
    try {
      const method = bookmarked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/savedListing/listing/save/${listing._id}`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        setSavedCount(data.savedCount);
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error('Error updating saved listing:', error);
    }
  };

  // Handle map pin click
  const handlePinClick = () => {
    if (listing.location?.coordinates) {
      const [lng, lat] = listing.location.coordinates;
      navigate(`/mapexplore?lat=${lat}&lng=${lng}`);
    }
  };

  return (
    <>
      {/* Main Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative">
        {/* Image Section */}
        <div
          className="relative h-52 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image */}
          <img
            src={listing.imageUrls[currentImageIndex]}
            alt={listing.name}
            className="w-full h-full object-cover rounded-t-lg transition-opacity duration-500"
            onClick={() => {
              setFullScreenIndex(currentImageIndex);
              setFullScreenOpen(true);
            }}
          />

          {/* Image Navigation Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {listing.imageUrls.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full cursor-pointer 
                  ${idx === currentImageIndex ? "bg-white" : "bg-gray-400"}`}
              />
            ))}
          </div>

          {/* Top-Right Controls */}
          <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg px-2 py-1 text-xs">
              {listing.type}
            </div>
            
            <button 
              onClick={handlePinClick}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-lg border border-white/30"
            >
              <MapPin className="w-4 h-4" stroke="white" fill="none" />
            </button>
            
            <div className="flex flex-col items-center">
              <button 
                onClick={handleBookmark}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-lg border border-white/30"
              >
                <Bookmark 
                  className="w-4 h-4" 
                  stroke="white" 
                  fill={bookmarked ? "white" : "none"} 
                />
              </button>
              <span className="text-xs text-white mt-0.5">{savedCount}</span>
            </div>
          </div>

          {/* Delete Button (if deletable) */}
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
              <div className="flex justify-between items-center">
                <p className="font-bold">{listing.name}</p>
                {listing.price && (
                  <p className="font-medium text-sm">KSH {listing.price}/month</p>
                )}
              </div>
              <p>{listing.bedrooms} Bedrooms</p>
              {listing.areaName && (
                <p className="text-xs text-gray-600">{listing.areaName}</p>
              )}
            </div>
            
            <button onClick={() => setExpanded(!expanded)}>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 
                  ${expanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </button>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-2 space-y-1 transition-all duration-300">
              {listing.description && (
                <p><strong>Description:</strong> {listing.description}</p>
              )}
              {listing.phoneNumber && (
                <p><strong>Phone:</strong> {listing.phoneNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullScreenOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setFullScreenOpen(false)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Arrows */}
            {fullScreenIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}
            
            {fullScreenIndex < listing.imageUrls.length - 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Image */}
            <div className="w-full max-w-4xl mx-auto">
              <img
                src={listing.imageUrls[fullScreenIndex]}
                alt={listing.name}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>

            {/* Image Counter - moved up from bottom */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-white">
              <span className="bg-black/50 px-4 py-2 rounded-full text-sm">
                {fullScreenIndex + 1} / {listing.imageUrls.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}