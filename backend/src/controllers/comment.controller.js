import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model";

export const getComments = asyncHandler(async(req, res) => {
    const {postId} = req.params;

    const comments = await Comment.find({post: postId})
        .sort({createdAt: -1})
        .populate("user", "username firstname lastName profilePicture");

    res.status(200).json({comments});   //request has been successful
});

export const createComment = asyncHandler(async(req, res) => {
    const {userId} = getAuth(req);
    const {postId} = req.params;
    const {content} = req.body;

    //Check if content has been provided and it is not equal to an empty string
    if (!content || content.trim() === ""){
        return res.status(400).json({error: "Comment content is required"});    //status code (400)-> bad request
    }

    //get user & post from the DB
    const user = await User.findOne({clerkId: userId});
    const post = await Post.findById({postId});

    //If both of them are not found: return
    if (!user || !post) return res.status(404).json({error: "User or post not found"});

    const comment = await Comment.create({
        user: user._id,
        post: postId,
        content,
    });

    // Link the comment to the post
    await Post.findByIdAndUpdate(postId, {
        $push: {comments: comment._id},
    });

    // Create notification if not commenting on own post
    if (post.user.toString() !== user._id.toString()){
        await Notification.create({
            from: user._id,
            to: post.user,
            type: "comment",
            post: postId,
            comment: comment._id,
        });
    }

    res.status(201).json({comment});    //status code (201): Object created
});

export const deleteComment = asyncHandler(async(req, res) => {
    const {userId} = getAuth(req);
    const {commentId} = req.params;

    //get the user and comment
    const user = await User.findOne({clerkId: userId});
    const comment = await Comment.findById(commentId);

    if (!user || !comment){
        return res.status(404).json({error: "User or comment not found"});
    }

    if (comment.user.toString() !== user._id.toString()) {
        return res.status(403).json({error: "You can only delete your own comments"})
    }

    //remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
        $pull: {comments: commentId},
    });

    //delete the comment 
    await Comment.findByIdAndDelete(commentId);

    //request has been successful
    res.status(200).json({message: "Comment deleted successfully"});
});