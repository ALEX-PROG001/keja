import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ListingCard from '../components/ListingCard';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function SavedListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/savedListing/user/saved`, {          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch saved listings');
        }
        const data = await res.json();
        setSavedListings(data.savedListings);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchSavedListings();
    } else {
      setLoading(false);
      setError('User not logged in');
    }
  }, [currentUser]);

  const handleDelete = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/savedListing/listing/save/${listingId}`, {        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success) {
        setSavedListings(prev => prev.filter(listing => listing._id !== listingId));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting saved listing:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="mx-auto max-w-md px-4 py-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Saved Listings</h1>
        {loading ? (
          <p>Loading saved listings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : savedListings.length === 0 ? (
          <p>No saved listings found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {savedListings.map(listing => (
              <ListingCard
                key={listing._id}
                listing={listing}
                deletable={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
