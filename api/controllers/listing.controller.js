import Listing from '../models/listing.model.js';
import { getAreaName } from '../../client/src/pages/geoHelper.js';

export const createListing = async (req, res, next) => {
  try {
    let locationData = req.body.location;

    // If location is provided as string coordinates
    if (locationData && typeof locationData === 'string') {
      const [lat, lng] = locationData.split(',').map(coord => parseFloat(coord.trim()));
      
      // Get area name using existing geoHelper function
      const areaName = await getAreaName(lat, lng);
      
      // Update the request body with location and area name
      req.body.location = {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
      };
      req.body.areaName = areaName;
    }

    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    if (!listings) {
      return res.status(404).json({
        success: false,
        message: 'No listings found'
      });
    }
    
    res.status(200).json({
      success: true,
      listings
    });
  } catch (error) {
    next(error);
  }
};
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
   
  }
  
  }
  export const updateListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only update your own listings!'));
      }
      
      // Convert location string to GeoJSON if needed
      if (req.body.location && typeof req.body.location === 'string') {
        const parts = req.body.location.split(',');
        if (parts.length === 2) {
          const lat = parseFloat(parts[0].trim());
          const lng = parseFloat(parts[1].trim());
          req.body.location = {
            type: 'Point',
            coordinates: [lng, lat]
          };
        }
      }
      
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      res.status(200).json({
        success: true,
        listing: updatedListing
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const getListings = async (req, res, next) => {
    try {
      const {
        searchTerm,
        type,
        bedrooms,
        minPrice,
        maxPrice,
      } = req.query;
  
      let searchQuery = {};
  
      // Search functionality
      if (searchTerm) {
        searchQuery.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { areaName: { $regex: searchTerm, $options: 'i' } }
        ];
      }
  
      // Add filters
      if (type && type !== 'all') {
        searchQuery.type = type;
      }
      
      if (bedrooms && bedrooms !== 'Any') {
        searchQuery.bedrooms = bedrooms;
      }
  
      if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = parseInt(minPrice);
        if (maxPrice && maxPrice !== 'above') searchQuery.price.$lte = parseInt(maxPrice);
      }
  
      const listings = await Listing.find(searchQuery).sort({ createdAt: 'desc' });
  
      res.status(200).json({
        success: true,
        listings
      });
  
    } catch (error) {
      next(error);
    }
  };
  export const saveListing = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      // Check if already saved
      const existingSave = await SavedListing.findOne({ listingId: id, userId });
      if (existingSave) {
        return next(errorHandler(400, 'Listing already saved'));
      }
  
      // Create save record and increment counter atomically
      await Promise.all([
        SavedListing.create({ listingId: id, userId }),
        Listing.findByIdAndUpdate(id, { $inc: { saves: 1 } })
      ]);
  
      // Get updated listing with new save count
      const updatedListing = await Listing.findById(id);
  
      res.status(200).json({
        success: true,
        saves: updatedListing.saves
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const unsaveListing = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      // Remove save record and decrement counter atomically
      await Promise.all([
        SavedListing.findOneAndDelete({ listingId: id, userId }),
        Listing.findByIdAndUpdate(id, { $inc: { saves: -1 } })
      ]);
  
      // Get updated listing with new save count
      const updatedListing = await Listing.findById(id);
  
      res.status(200).json({
        success: true,
        saves: updatedListing.saves
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const getUserSavedListings = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const savedListings = await SavedListing.find({ userId })
        .populate('listingId')
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        savedListings: savedListings.map(sl => sl.listingId)
      });
    } catch (error) {
      next(error);
    }
  };