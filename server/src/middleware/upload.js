import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/apiError.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
});

export const uploadSingleImage = upload.single("image");

export async function uploadImageToCloudinary(file, folder = "quickbite") {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(new ApiError(500, "Image upload failed", error.message));
        return resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(file.buffer);
  });
}

