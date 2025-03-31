import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ListingCard from '../components/ListingCard';

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Filters from URL (if any) or default values
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [priceRange, setPriceRange] = useState('');

  // Listing state
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  // Options for dropdowns
  const bedroomOptions = ['Any', '1', '2', '3', '4', '5'];
  const priceRanges = [
    { label: 'Below 10k', value: '0-10000' },
    { label: '10k-15k', value: '10000-15000' },
    { label: '15k-20k', value: '15000-20000' },
    { label: '20k-25k', value: '20000-25000' },
    { label: 'Above 30k', value: '30000-above' }
  ];
  const propertyTypes = ['rentals', 'for-sale', 'bnbs'];

  // Fetch listings whenever a filter changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (propertyType) params.append('type', propertyType);
      if (bedrooms && bedrooms !== 'Any') params.append('bedrooms', bedrooms);
      if (priceRange) {
        const [min, max] = priceRange.split('-');
        if (min) params.append('minPrice', min);
        if (max && max !== 'above') params.append('maxPrice', max);
      }
      try {
        const res = await fetch(`/api/listing/search?${params.toString()}`);
        const data = await res.json();
        setListings(data.listings || data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
      setLoading(false);
    };

    fetchListings();
  }, [searchTerm, propertyType, bedrooms, priceRange]);

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto max-w-md px-4 py-6 mb-20">
        {/* Condensed search input with inline icon */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search listings..."
            className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
        </div>

        {/* Horizontal condensed filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            <option value="">Type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            <option value="">Beds</option>
            {bedroomOptions.map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            <option value="">Price</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Listings Display */}
        {loading ? (
          <p className="text-center">Loading listings...</p>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
