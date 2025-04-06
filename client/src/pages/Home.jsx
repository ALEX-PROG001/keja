import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Search from '../components/search';
import BottomNav from '../components/BottomNav';
import ListingCard from '../components/ListingCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [listings, setListings] = useState([]);

  // Fetch counts by type (for categories) dynamically
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Assuming this endpoint returns all listings (or you could create a dedicated one for counts)
        const res = await fetch('/api/listing/search');
        const data = await res.json();
        const fetchedListings = data.listings || [];
        const countsMap = {};
        fetchedListings.forEach(listing => {
          countsMap[listing.type] = (countsMap[listing.type] || 0) + 1;
        });
        setCounts(countsMap);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  // Fetch a few listings to display on the homepage (Featured Listings)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/getall');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  // Define categories with dynamic counts based on the counts object.
  const categories = [
    {
      title: "Rentals",
      count: `${counts["rentals"] || 0} homes`,
      image: "https://cdn.usegalileo.ai/sdxl10/9f9cddb7-6283-4dd1-b531-0574df37f5bf.png",
      filter: "rentals"
    },
    {
      title: "BnBs",
      count: `${counts["bnbs"] || 0} homes`,
      image: "https://cdn.usegalileo.ai/sdxl10/e7f81918-3f1f-4418-b99f-74caf9a54098.png",
      filter: "bnbs"
    },
    {
      title: "For Sale",
      count: `${counts["for-sale"] || 0} homes`,
      image: "https://cdn.usegalileo.ai/sdxl10/a87e739e-9059-40a3-a144-587f6d7667a8.png",
      filter: "for-sale"
    },
    {
      title: "Technicians",
      count: `${counts["technicians"] || 0} pros`,
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
      filter: "technicians"
    },
    {
      title: "Movers",
      count: `${counts["movers"] || 0} teams`,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
      filter: "movers"
    },
    {
      title: "Architects & Engineers",
      count: `${counts["architects"] || 0} pros`,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      filter: "architects"
    }
  ];

  const handleCategoryClick = (filter) => {
    navigate(`/search?type=${filter}`);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div className="flex-1">
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
          <div className="relative rounded-xl overflow-hidden">
            <div 
              className="bg-cover bg-center flex flex-col justify-end h-[400px] sm:h-[500px] lg:h-[600px]"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 30%), 
                                  url("https://cdn.usegalileo.ai/sdxl10/8d7e9c71-7a17-4e33-8677-e3df4ff38773.png")`
              }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Find your dream home
                </p>
              </div>
                            {/* Glassmorphic "Explore on Map" Button */}
                            <button 
  onClick={() => navigate('/mapexplore')}
  className="absolute top-6 left-4 right-4 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg py-2 px-3 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
>
  <span className="text-black font-semibold text-lg">Explore on Map</span>
</button>
            </div>
          </div>
        </div>

        <Search />

      {/* Categories Section */}
<div className="px-4 sm:px-6 lg:px-8 py-8 mb-20">
  <button 
    onClick={() => navigate('/search')}
    className="text-black text-2xl sm:text-3xl font-bold leading-tight mb-8 hover:underline"
  >
    Explore
  </button>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {categories.map((category, index) => (
      <div 
        key={index} 
        onClick={() => handleCategoryClick(category.filter)}
        className="relative rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300"
      >
        {/* Updated image height */}
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-[300px] sm:h-[450px] lg:h-[500px] object-cover"
        />
        {/* Glass-morphic button overlay with smaller gap and black text */}
        <button
          className="absolute bottom-2 left-2 right-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg py-2 px-3 flex justify-between items-center"
        >
          <span className="text-black font-semibold text-lg">{category.title}</span>
          <span className="text-black text-base">{category.count}</span>
        </button>
      </div>
    ))}
  </div>
</div>



        {/* Featured Listings */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-black text-2xl sm:text-3xl font-bold leading-tight mb-4">
            Featured Listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
