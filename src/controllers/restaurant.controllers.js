import { Restaurant } from "../models/restaurant.models.js";
import distanceCalculator from "../utils/distanceCalculator.js";


//Getting restuarants by coordinates and radius
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
      res.status(404).json({
        success: false,
        message: "No restaurants found within the specified radius.",
      });
    }
  } catch (error) {
    console.error(error); // Log the error to the console for debugging
    next(error);
  }
};

//Getting restaurantby distance range
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
     res.status(201).json({
       success: true,
       message: filteredRestaurants,
     });
  } catch (error) {
    next(error);
  }
};


//Add restaurant
export const addRestaurant = async (req, res, next) => {
  //Get the data from the frontend
  //create inside the database
  //return the response

  try {
    const { name, description, location, ratings } = req.body;

    await Restaurant.create({
      name,
      description,
      location,
      ratings,
      user: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Restaurant Added Successfully",
    });
  } catch (error) {
    next(error);
  }
};


//Get restaurant by id
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Restaurant retrieved successfully",
      restaurant: restaurant,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


//Get All Restaurants
export const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      success: true,
      message: "All restaurants retrieved successfully",
      restaurants: restaurants,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//Update Restaurant By Id
export const updateRestaurantById = async (req, res, next) => {
  try {
    const { name, description, location, ratings } = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { name, description, location, ratings },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


//Delete Restaurant By Id
export const deleteRestaurantById = async (req, res, next) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
