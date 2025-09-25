import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";
import { syncUser } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { followUser } from "../controllers/user.controller.js";

const router = express.Router()

{/** Methods for the user */}
{/** public route */}
router.get("/profile/:username", getUserProfile);   //GET REQUEST: /profile/:username -> once on the path we will the getUserProfile method

{/** Protected Routes */}
//Once user sign-ups it is saved on clerk, but then I want to sync the user details to the DB
router.put("/sync", protectedRoute, syncUser);

//Get current User
router.put("/me", protectedRoute, getCurrentUser);

//If we hit the profile first protect the profile: check user is authenticated or not; if so call the next function
router.put("/profile", protectedRoute, updateProfile);

//Follow user
router.put("/follow/:targetUserId", protectedRoute, followUser);

export default router;