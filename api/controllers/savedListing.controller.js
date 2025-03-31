import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Save a listing for the authenticated user
export const saveListing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, 'Listing not found'));

    // Atomically add the listingId to savedListings without revalidating the whole user
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedListings: listingId } },
      { new: true }
    );
    if (!user) return next(errorHandler(404, 'User not found'));

    // Update the listing's savedCount
    listing.savedCount = (listing.savedCount || 0) + 1;
    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing saved successfully',
      savedCount: listing.savedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Unsave a listing for the authenticated user
export const unsaveListing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const listingId = req.params.id;

    // Verify the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, 'Listing not found'));

    // Atomically remove the listing from the user's savedListings array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedListings: listingId } },
      { new: true }
    );
    if (!user) return next(errorHandler(404, 'User not found'));

    // Update the listing's savedCount
    listing.savedCount = Math.max((listing.savedCount || 1) - 1, 0);
    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing removed from saved listings',
      savedCount: listing.savedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve all saved listings for the authenticated user
export const getSavedListings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('savedListings');
    if (!user) return next(errorHandler(404, 'User not found'));

    res.status(200).json({ success: true, savedListings: user.savedListings });
  } catch (error) {
    next(error);
  }
};
