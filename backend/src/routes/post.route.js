import express from "express";
import { getPosts, likePost } from "../controllers/post.controller.js";
import { getPost } from "../controllers/post.controller.js";
import { getUserPosts } from "../controllers/post.controller.js";
import { protectedRoute, createPost, likePost } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

//Public Routes
router.get("/", getPosts);
//Get single post
router.get("/:postId", getPost);
//Get user posts
router.get("/user/:username", getUserPosts);

{/** Protected Route */}
router.post("/", protectedRoute, upload.single("image"), createPost);
router.post("/:postId/like", protectedRoute, likePost)

export default router;