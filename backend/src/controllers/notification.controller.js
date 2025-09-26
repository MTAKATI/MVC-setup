import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";
import User from "../models/post.model.js";

export const getNotifications = asyncHandler (async(req, res) => {
    const {userId} = getAuth(req);

    //find the user
    const user = await User.findOne({clerkId: userId});
    if (!user) return res.status(404).json({error: "User not found"});

    const notifications = await Notification.find({to: user._id})
        .sort({createdAt: -1})
        .populate("from", "username firstName lastNName profilePicture")
        .populate("post", "content image")
        .populate("comment", "content");
    
    //if the request is successful: return
    res.status(200).json({notifications});
});

export const deleteNotification = asyncHandler (async(res, req) => {
    const {userId} = getAuth(req);
    const {notifications} = req.params;

    const user = await User.findOne({clerkId: userId});
    if (!user) return res.status(404).json({error: "User not found"});

    //find the notification
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        to: user._id,
    });

    //response failed
    if (!notification) return res.status(404).json({error: "Notification not found"});
    //response success
    res.status(200).json({message: "Notification deleted successfully"});
})