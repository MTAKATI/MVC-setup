import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["follow, like, comment, chat"],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        comment: [
            {
                commenter: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                dateCreated: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {timestamps: true}
)

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;