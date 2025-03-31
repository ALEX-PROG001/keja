import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page imports with consistent naming
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Settings from './pages/Settings'; // Changed from settings
import CreateListing from './pages/CreateListing';
import UploadPage from './pages/UploadPage'; // Changed from Uploadpage
import MyListing from './pages/MyListing';
import AllListings from './pages/AllListings'; // Changed from All_listings
import UpdateListing from './pages/UpdateListing';
import MapExplore from './pages/MapExplore'; // Changed from Mapexplore
import Search from './pages/Search';
import SearchResults from './pages/SearchResults'; // Changed from Searchresults
import SavedListings from './pages/SavedListings';
import MyPosts from './pages/MyPosts'; // Changed from Myposts
import CreatePosts from './pages/CreatePosts';
import BlogPage from './pages/BlogPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/my-listing" element={<MyListing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/all-listings" element={<AllListings />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map-explore" element={<MapExplore />} />
          <Route path="/saved-listings" element={<SavedListings />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/create-post" element={<CreatePosts />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}