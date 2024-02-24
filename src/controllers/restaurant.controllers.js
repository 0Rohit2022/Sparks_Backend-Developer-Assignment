import { Restaurant } from "../models/restaurant.models.js";
import distanceCalculator from "../utils/distanceCalculator.js";
import ErrorHandler from "../middleware/error.middleware.js";

// Getting restaurants by coordinates and radius
export const getRestaurantsByCoordinatesAndRadius = async (req, res, next) => {
  try {
    const { latitude, longitude, radius } = req.body;
    const restaurants = await Restaurant.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6371], // Earth radius in km
        },
      },
    }).sort({ "location.coordinates": 1 }); // Sort by distance from provided coordinates

    if (restaurants.length > 0) {
      res.status(200).json({
        success: true,
        message: restaurants,
      });
    } else {
      throw new ErrorHandler(
        "No restaurants found within the specified radius.",501
      );
    }
  } catch (error) {
    next(error);
  }
};

// Getting restaurants by distance range
export const getRestaurantsByDistanceRange = async (req, res, next) => {
  try {
    const { latitude, longitude, minDistance, maxDistance } = req.body;
    const restaurants = await Restaurant.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], maxDistance / 6371], // Earth radius in km
        },
      },
    }).sort({ "location.coordinates": 1 }); // Sort by distance from provided coordinates

    const filteredRestaurants = restaurants.filter((restaurant) => {
      const distance = distanceCalculator.calculateDistance(
        latitude,
        longitude,
        restaurant.location.coordinates[1],
        restaurant.location.coordinates[0] // MongoDB stores coordinates in reverse order
      );
      return distance >= minDistance && distance <= maxDistance;
    });

    res.status(200).json({
      success: true,
      message: filteredRestaurants,
    });
  } catch (error) {
    next(error);
  }
};

// Add restaurant
export const addRestaurant = async (req, res, next) => {
  try {
    const { name, description, location, ratings } = req.body;
    const restaurant = await Restaurant.create({
      name,
      description,
      location,
      ratings,
      user: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Restaurant Added Successfully",
      restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurant by id
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      throw new ErrorHandler("Restaurant not found",401);
    }
    res.status(200).json({
      success: true,
      message: "Restaurant retrieved successfully",
      restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Get all restaurants
export const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      success: true,
      message: "All restaurants retrieved successfully",
      restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// Update restaurant by id
export const updateRestaurantById = async (req, res, next) => {
  try {
    const { name, description, location, ratings } = req.body;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { name, description, location, ratings },
      { new: true }
    );
    if (!updatedRestaurant) {
      throw new ErrorHandler("Restaurant not found", 401);
    }
    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Delete restaurant by id
export const deleteRestaurantById = async (req, res, next) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      throw new ErrorHandler("Restaurant not found" , 401);
    }
    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
