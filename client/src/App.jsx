import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page imports with consistent naming
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Settings from './components/Settings.jsx'; // Changed from settings//help

import CreateListing from './pages/CreateListing';
import UploadPage from './pages/newfolder/UploadPage.jsx'; // Changed from Uploadpage
import MyListing from './pages/MyListing';
import AllListings from './pages/AllListings'; // Changed from All_listings
import UpdateListing from './pages/UpdateListing';
import MapExplore from './pages/newfolder/MapExplore.jsx'; // Changed from Mapexplore
import Search from './pages/Search';
import SearchResults from './pages/newfolder/SearchResults.jsx'; // Changed from Searchresults
import SavedListings from './pages/newfolder/SavedListings';
import MyPosts from './pages/newfolder/MyPosts'; // Changed from Myposts
import CreatePosts from './components/CreatePosts.jsx';
import BlogPage from './components/BlogPage';
import MapLayout from './pages/newfolder/MapLayout.jsx';
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
          <Route path="/mapexplore" element={<MapExplore />} />
          <Route path="/saved-listings" element={<SavedListings />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/create-post" element={<CreatePosts />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/maplayout" element={<MapLayout />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}