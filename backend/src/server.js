import express from "express";
import cors from "cors";    //allow request made by the front-end: {Cross-Origin-Resourve-Sharing}
import {clerkMiddleware} from "@clerk/express";     //supports the authentication

import userRoutes from  './routes/user.route.js';
import postRoutes from  './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import notificationRoutes from './routes/notification.route.js';

import {ENV} from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

app.use(cors);
app.use(express.json()) //to access the requested body

app.use(clerkMiddleware()); //handle authentication
app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Hello form server")); 

{/** User Routes */}
app.use("/api/users", userRoutes);
{/** Post Routes */}
app.use("/api/posts", postRoutes);
{/** Comments Routes */}
app.use("/api/comments", commentRoutes);
{/** Notification Routes */}
app.use("/api/notifications", notificationRoutes);

{/** Error handling middleware */}
//For debugging purposes
app.use((err, req, res, next) => {
    console.log("Unlimited error:", err);
    res.status(500).json({error: err.message || "Internal server error"});
})

const startServer = async() => {
    try {
        await connectDB();
        
        if(ENV.NODE_ENV !== "production"){
            app.listen(ENV.PORT, ()=> console.log("Server is up and running on PORT:", ENV.PORT));
        }
    } catch (error) {
        console.log("Failed to start the server:", error.message);
        process.exit(1);
    }
};

startServer();

//export for vercel
export default app;
// app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));