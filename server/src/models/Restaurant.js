import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },
    rating: { type: Number, default: 4.2, min: 0, max: 5 },
    deliveryTimeMins: { type: Number, default: 30, min: 5, max: 180 }
  },
  { timestamps: true }
);

restaurantSchema.index({ name: "text", category: "text" });
restaurantSchema.index({ category: 1 });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);

