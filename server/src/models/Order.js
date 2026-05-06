import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    qty: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Order items cannot be empty"
      }
    },
    address: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      line1: { type: String, required: true, trim: true },
      line2: { type: String, trim: true, default: "" },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true }
    },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending", index: true },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Out for delivery", "Delivered"],
      default: "Pending",
      index: true
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

