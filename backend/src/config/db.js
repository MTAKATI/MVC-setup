import mongoose from "mongoose";
import {ENV} from "./env.js";

export const connectDB = async () => {
    try{
        console.log("Connecting to MongoDB with URI: ", ENV.MONGO_URI);
        await mongoose.connect(ENV.MONGO_URI);
        console.log("connection successful");   
    } catch (error){
        console.log("Error connecting to MONGODB");
        process.exit(1);
    }
}