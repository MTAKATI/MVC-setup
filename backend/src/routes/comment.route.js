import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {createComment, deleteComment, getComments} from "../controllers/comment.controller.js";

const router = express.Router();

//public routes
router.get("/post/:postId", getComments);   //get all the posts by passing the postID

// protect routes
router.post("/post/:postId", protectedRoute, createComment);
router.post("/post/:postId", protectedRoute, deleteComment);

export default router;