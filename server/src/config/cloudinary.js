import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

if (env.CLOUDINARY_URL) {
  // Cloudinary SDK reads CLOUDINARY_URL from process.env during config init.
  process.env.CLOUDINARY_URL = env.CLOUDINARY_URL;
  cloudinary.config(true);
  cloudinary.config({ secure: true });
} else {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export { cloudinary };

