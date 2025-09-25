import express from "express";
import cors from "cors";    //allow request made by the front-end: {Cross-Origin-Resourve-Sharing}
import {clerkMiddleware} from "@clerk/express";     //supports the authentication

import userRoutes from  './routes/user.route.js';

import {ENV} from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors);
app.use(express.json()) //to access the requested body

app.use(clerkMiddleware()); //handle authentication

app.get("/", (req, res) => res.send("Hello form server")); 

{/** User Routes */}
app.use("/api/users", userRoutes);

const startServer = async() => {
    try {
        await connectDB();
        app.listen(ENV.PORT, ()=> console.log("Server is up and running on PORT:", ENV.PORT));
    } catch (error) {
        console.log("Failed to start the server:", error.message);
        process.exit(1);
    }
}
// app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));