import express from 'express';

import { 
  createListing,
  getUserListings,
  getAllListings,
  deleteListing,
  getListing,
  updateListing,
  getListings,
 
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.get('/user/:id', verifyToken, getUserListings);
router.get('/getall', getAllListings);
router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/get/:id', getListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/search', getListings); // Changed from '/get' to '/search' for clarity


export default router;