import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
     // Field to track saved/bookmarked listings by the user
     savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
     // Add other fields as necessary
     savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
