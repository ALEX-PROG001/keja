import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: String,
      required: function() {
        return !['technicians', 'architects', 'engineers', 'interior-designer', 'furniture'].includes(this.type);
      }
    },
    type: {
      type: String,
      enum: [
        'rentals', 'for-sale', 'bnbs', 'technicians', 
        'architects', 'engineers', 'interior-designer', 'furniture'
      ],
      required: true,
    },
    furnished: {
      type: Boolean,
      default: false
    },
    parking: {
      type: Boolean,
      default: false
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;