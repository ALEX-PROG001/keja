import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Profile from './pages/Profile';
import Header from "./components/Header";
import BottomNav from './components/BottomNav';
import Settings from './pages/settings';
import CreateListing from './pages/CreateListing';
import UploadPage from './pages/Uploadpage';
import MyListing from './pages/MyListing';
import AllListings from './pages/All_listings';
import UpdateListing from './pages/UpdateListing';
import Mapexplore from './pages/Mapexplore';
import Search from './pages/Search';
import Searchresults from './pages/Searchresults';
import MyListings from './pages/MyListing';
import SavedListings from './pages/SavedListings';
import Myposts from './pages/Myposts';
import CreatePosts from './pages/CreatePosts';
import BlogPage from './pages/BlogPage';

export default function App() {
  return (
    <BrowserRouter>
     <div className="min-h-screen">
        <Header /> {/* Move Header here, outside of Routes */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/my-listing' element={<MyListing />} />
          
          <Route path='/profile' element={<Profile />} />
          <Route path='/update-listing/:listingId'element={<UpdateListing />}/> 
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/all_listings' element={<AllListings />} />
          <Route path='/uploadpage' element={<UploadPage />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/search' element={<Search />} />
          <Route path='/mapexplore' element={<Mapexplore />} />
          <Route path='/saved-listings' element={<SavedListings />} />
          <Route path='/searchresults' element={<Searchresults />} />
          <Route path='/listings' element={<MyListings />} />
          <Route path='/my-posts'element={<Myposts />}/>
          <Route path='/create-post' element={<CreatePosts/>} />
         <Route path='/blog' element={<BlogPage/>} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}