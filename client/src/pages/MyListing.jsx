import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash, Edit, Plus } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteListingId, setDeleteListingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/listing/getall', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
          return;
        }

        const userId = currentUser._id;
        const filteredListings = data.filter(
          (listing) => String(listing.userRef) === userId
        );

        setListings(filteredListings);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Error fetching listings');
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [currentUser]);

  const handleListingDelete = async () => {
    try {
      const res = await fetch(`/api/listing/delete/${deleteListingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== deleteListingId)
      );
      setShowDeleteConfirm(false);
      setDeleteListingId(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditListing = (listing) => {
    navigate('/create-listing', { state: { listing } });
  };

  // ListingCard subcomponent for cleaner code
  const ListingCard = ({ listing }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);

    // For swipe detection on carousel
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    // Full-screen modal state
    const [fullScreenOpen, setFullScreenOpen] = useState(false);
    const [fullScreenIndex, setFullScreenIndex] = useState(0);

    const handleTouchStart = (e) => {
      setTouchStartX(e.changedTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
      setTouchEndX(e.changedTouches[0].clientX);
    };

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

    // Handlers for full screen swipe (reuse similar logic)
    const handleFullScreenTouchStart = (e) => {
      setTouchStartX(e.changedTouches[0].clientX);
    };

    const handleFullScreenTouchMove = (e) => {
      setTouchEndX(e.changedTouches[0].clientX);
    };

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
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    idx === currentImageIndex ? "bg-white" : "bg-gray-400"
                  }`}
                ></span>
              ))}
            </div>
            {/* Top Right Controls */}
            <div className="absolute top-2 right-2 flex flex-col items-center space-y-2">
              <div className="bg-black text-white px-3 py-1 text-xs font-semibold rounded-full">
                {listing.type}
              </div>
              <button
                onClick={() => {
                  setDeleteListingId(listing._id);
                  setShowDeleteConfirm(true);
                }}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition"
              >
                <Trash size={16} />
              </button>
              <button
                onClick={() => handleEditListing(listing)}
                className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-700 transition"
              >
                <Edit size={16} />
              </button>
            </div>
          </div>
          {/* Info Section with Dropdown */}
          <div className="p-2 bg-gray-200 rounded-b-lg text-sm">
            <div className="flex justify-between items-center">
              <div>
                <p>
                  <strong>{listing.name}</strong>
                </p>
                <p>{listing.bedrooms} Bedrooms</p>
              </div>
              <button onClick={() => setExpanded(!expanded)}>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
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
            {expanded && (
              <div className="mt-2 space-y-1 transition-all duration-300">
                {listing.description && (
                  <p>
                    <strong>Description:</strong> {listing.description}
                  </p>
                )}
                {listing.phoneNumber && (
                  <p>
                    <strong>Phone:</strong> {listing.phoneNumber}
                  </p>
                )}
                {listing.price && (
                  <p>
                    <strong>Price:</strong> {listing.price}
                  </p>
                )}
                {/* Additional fields can be added here */}
              </div>
            )}
          </div>
        </div>

        {/* Full-screen modal */}
        {fullScreenOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <button
      className="absolute top-4 right-4 text-white text-3xl"
      onClick={(e) => { e.stopPropagation(); setFullScreenOpen(false); }}
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
      {/* Full-screen indicators */}
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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto px-1 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
          <button
            onClick={() => navigate('/create-listing')}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
          >
            <Plus size={24} />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-gray-800 mb-4">
              Are you sure you want to delete this listing?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleListingDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
