import express from "express";
const router = express.Router();

import {
  addRestaurant,
  getRestaurantsByCoordinatesAndRadius,
  getRestaurantsByDistanceRange,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
} from "../controllers/restaurant.controllers.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

// CRUD Endpoints
router.post("/radius", isAuthenticated, getRestaurantsByCoordinatesAndRadius);
router.post("/range", isAuthenticated, getRestaurantsByDistanceRange);
router.post("/addrestaurant", isAuthenticated, addRestaurant);
router.delete("/:id", isAuthenticated, deleteRestaurantById);
router.put("/:id", isAuthenticated, updateRestaurantById);
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

export default router;
