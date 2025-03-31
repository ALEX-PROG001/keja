import Listing from '../models/listing.model.js';

export const createListing = async (req, res, next) => {
  try {
    // If location is a string, convert it to GeoJSON
    if (req.body.location && typeof req.body.location === 'string') {
      const parts = req.body.location.split(',');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        req.body.location = {
          type: 'Point',
          coordinates: [lng, lat] // Note: GeoJSON expects [longitude, latitude]
        };
      }
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
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      
      const searchQuery = {};
      
      // Search term - now searches in both name and description
      if (req.query.searchTerm) {
        searchQuery.$or = [
          { name: { $regex: req.query.searchTerm, $options: 'i' } },
          { description: { $regex: req.query.searchTerm, $options: 'i' } }
        ];
      }
  
      // ... keep existing filters ...
      if (req.query.type && req.query.type !== 'all') {
        searchQuery.type = req.query.type;
      }
  
      if (req.query.furnished === 'true') {
        searchQuery.furnished = true;
      }
      if (req.query.parking === 'true') {
        searchQuery.parking = true;
      }
  
      if (req.query.minPrice || req.query.maxPrice) {
        searchQuery.price = {};
        if (req.query.minPrice) searchQuery.price.$gte = parseInt(req.query.minPrice);
        if (req.query.maxPrice) searchQuery.price.$lte = parseInt(req.query.maxPrice);
      }
  
      console.log('Search Query:', searchQuery); // Debug log
  
      const listings = await Listing.find(searchQuery)
        .sort({ createdAt: 'desc' })
        .limit(limit)
        .skip(startIndex);
  
      const total = await Listing.countDocuments(searchQuery);
  
      res.status(200).json({
        success: true,
        total,
        listings
      });
  
    } catch (error) {
      next(error);
    }
  };