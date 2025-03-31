import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
      // Remove default since it will be set from req.user.username
    },
    content: {
      type: String,
      required: false,
      default: '', // Add default empty string for optional content
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Add trim to remove whitespace
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    image: {
      type: String,
      required: false,
      default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      required: false,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: false,
      unique: true, // Add unique constraint for slug
    },
  },
  { timestamps: true }
);

// Improve slug generation middleware
postSchema.pre('save', function(next) {
  if (this.title) {
    this.slug = this.title
      .trim()
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '')
      .replace(/-+/g, '-'); // Remove multiple consecutive dashes
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;