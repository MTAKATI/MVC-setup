import express from "express";
import { protectedRoute} from "../middleware/auth.middleware.js";
import {getNotifications, deleteNotification} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.delete("/:notificationId", protectedRoute, deleteNotification);

export default router;