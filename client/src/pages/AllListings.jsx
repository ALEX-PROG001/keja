import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Plus, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function AllListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedListings, setExpandedListings] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const fetchAllListings = async () => {
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

    fetchAllListings();
  }, [currentUser]);

  const toggleExpand = (id) => {
    setExpandedListings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto px-2 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">All Listings</h1>
          <button
            onClick={() => navigate('/create-listing')}
            className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white/70 backdrop-blur-md rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow relative">
              <div className="relative h-52">
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-xs font-semibold rounded-full">
                  {listing.type}
                </div>
              </div>

              <div className={`p-3 rounded-b-xl transition-[height] duration-500 ease-in-out ${expandedListings[listing._id] ? 'h-auto' : 'h-16'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold text-gray-800">Ksh {listing.price}</span>
                    {listing.bedrooms && (
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs font-medium rounded-full text-center mt-1">
                        {listing.bedrooms} BR
                      </span>
                    )}
                  </div>
                  <div className="flex items-center cursor-pointer" onClick={() => toggleExpand(listing._id)}>
                    <MapPin size={16} className="text-maroon-700 mr-2" />
                    {expandedListings[listing._id] ? <ChevronUp size={20} className="text-gray-800" /> : <ChevronDown size={20} className="text-gray-800" />}
                  </div>
                </div>
                <div className={`transition-opacity duration-500 ease-in-out ${expandedListings[listing._id] ? 'opacity-100' : 'opacity-0 hidden'}`}>
                  <p className="text-gray-600 text-sm mt-2">{listing.description}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    <div>Created: {new Date(listing.createdAt).toLocaleDateString()}</div>
                    <div>Updated: {new Date(listing.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
