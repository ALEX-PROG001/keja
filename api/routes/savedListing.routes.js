import express from 'express';
import { saveListing, unsaveListing, getSavedListings } from '../controllers/savedListing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/listing/save/:id', verifyToken, saveListing);
router.delete('/listing/save/:id', verifyToken, unsaveListing);
router.get('/user/saved', verifyToken, getSavedListings);

export default router;
