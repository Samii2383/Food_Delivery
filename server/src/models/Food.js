import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    price: { type: Number, required: true, min: 1 },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

foodSchema.index({ name: "text", category: "text" });
foodSchema.index({ category: 1, restaurant: 1 });

export const Food = mongoose.model("Food", foodSchema);

