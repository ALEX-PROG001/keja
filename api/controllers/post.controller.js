import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  try {
    console.log('User from request:', req.user);

    if (!req.user || !req.user.id) {
      return next(errorHandler(401, 'You must be logged in to create a post'));
    }

    if (!req.body.title) {
      return next(errorHandler(400, 'Title is required'));
    }

    const newPost = new Post({
      ...req.body,
      userId: req.user.id,
      author: req.user.username, // Ensure username exists in req.user
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Post creation error:', error);
    next(error);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, 'You must be logged in to view your posts'));
    }

    const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    next(error);
  }
};

// Fetch all posts sorted by newest first
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    next(error);
  }
};
