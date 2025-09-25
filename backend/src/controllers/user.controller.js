import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { clerkClient, getAuth } from "@clerk/express";       //gives the userID

export const getUserProfile = asyncHandler(async (req, res) => {
    const {username} = req.params;      //Get the username
    const user = await User.findOne({username});    //try to find the user with exact username

    {/** Error handling */}
    //Failed Request
    if (!user) return res.status(404).json({error: "User not found"});  //if user not found just return "User not found" {404 error Request}
    //Request Success
    res.status(200).json({user});   
});

export const updateProfile = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);      //Gives you the userID from clerk
    
    //Find User in the DB: goes into User collection, find User {clerkId: userId} and try to update, pass the req.body {whatever the user tries to update}
    const user = await User.findOneAndUpdate({clerkId: userId}, req.body, {new: true});
    //Check iif user existed or not
    if (!user) return res.status(404).json({error: "User not found"});
    //Request has been success: User found
    res.status(200).json({user});
});

export const syncUser = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);  //Gives you the userID from clerk

    //Checks from MONGODB if user already exists in DB
    const existingUser = await User.findOne({clerkId: userId});

    if (existingUser){  //User exists in DB
        return res.status(200).json({User: existingUser, message: "User already exists"});
    }
    //create new user form clerk data
    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],   //sandiso@gmail.com : {username: sandiso}
        profilePicture: clerkUser.imageUrl || "",
    };

    const user = await User.create(userData);   //creates the User and stores the information userData

    {/** Status code: 202 -> Resource has been created */}
    res.status(202).json({user, message: "User created successfully"});
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);      //get userId from clerk
    const user = await User.findOne({clerkId: userId});     //Checks for user with the exact userId

    //If user does not exist: return "User not found"
    if (!user) return res.status(404).json({error: "User not found"})
    //Request Sucess
    res.status(200).json({user});

})

export const followUser = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);  //get userId from clerk: currently authenticated user
    const {targetUserId} = req.params;  //that we will click to follow or unfollow

    if (userId === targetUserId) return res.status(400).json({error: "You cannot follow yourself"});

    {/** Check both Users are existing or not */}
    const getCurrentUser = await User.findOne({clerkId: userId});
    const targetUser = await User.findById({targetUserId});
    //if not: Throws an error
    if (!currentUser || !targetUser) return res.status(404).json({error: "User not found"});

    {/** Check if you are following or not */}
    if (isFollowing){
        // unfollow
        await User.findByIdAndUpdate(currentUser._id, {
            $pull: {following: targetUserId},       //$pull: to pull id: means unfollowing
        });
        await User.findByIdAndUpdate(targetUser._id, {
            $pull: {followers: currentUser._id},        //remove from followers list
        })
    } else {
        // follow 
        await User.findByIdAndUpdate(currentUser._id, {
            $push: {following: targetUserId},
        });
        await User.findByIdAndUpdate(targetUser._id, {
            $push: {followers: currentUser._id},
        });

        // create notification
        await Notification.create({
            from: currentUser._id,
            to: targetUserId,
            type: "follow",
        });
    }

    res.status(200).json({
        message: isFollowing ? "User unfollowed successfully": "User followed successfully",
    });
});