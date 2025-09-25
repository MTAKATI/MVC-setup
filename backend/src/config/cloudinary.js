import {v2 as cloudinary} from "cloudinary";        //stores images : has larger space
import {ENV} from "./env.js";           //gets the ENV 

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLERK_SECRET_KEY,
});

export default cloudinary;