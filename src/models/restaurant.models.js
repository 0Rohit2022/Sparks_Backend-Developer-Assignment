import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [Number], // [longitude, latitude]
  },
  ratings: [Number],
});

restaurantSchema.index({ location: "2dsphere" }); // Index for geospatial queries

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
 