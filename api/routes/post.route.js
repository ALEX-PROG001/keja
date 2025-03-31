// routes/post.route.js
import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getMyPosts,getAllPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/my', verifyToken, getMyPosts);
router.get('/all', getAllPosts);

export default router;
