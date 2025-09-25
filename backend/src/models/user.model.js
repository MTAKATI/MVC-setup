import mongoose from "mongoose";

const userShema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        profilePicture: {
            type: String,
            required: true,
        },
        bannerImage: {
            type: Blob,
            required: true,
        },
        bio: {
            type: String,
            required: true,
            maxLength: 160,
        },
        location: {
            type: String,
            required: true,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    }, 
    {timestamps: true}
);

const User = mongoose.model("User", userShema);

export default User; 