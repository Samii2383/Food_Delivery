import crypto from "crypto";
import Razorpay from "razorpay";
import { Order } from "../models/Order.js";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";

const DELIVERY_CHARGE = 49;

function normalizeItems(items = []) {
  return items.map((item) => ({
    foodId: item.id,
    name: item.name,
    price: Number(item.price),
    qty: Number(item.qty)
  }));
}

function totals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryCharge = subtotal > 0 ? DELIVERY_CHARGE : 0;
  const total = subtotal + deliveryCharge;
  return { subtotal, deliveryCharge, total };
}

function getRazorpayClient() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay is not configured on server");
  }
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET
  });
}

export async function createRazorpayOrder(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, "Items are required");

  const normalizedItems = normalizeItems(items);
  const { total } = totals(normalizedItems);
  if (!Number.isFinite(total) || total <= 0) throw new ApiError(400, "Invalid total amount");

  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: `qb_${Date.now()}_${String(req.user.id).slice(-6)}`
  });

  res.json({
    success: true,
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: env.RAZORPAY_KEY_ID
    }
  });
}

export async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, address, paymentMethod } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Payment verification fields are required");
  }
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, "Items are required");
  if (!address) throw new ApiError(400, "Address is required");

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Payment verification failed");
  }

  const normalizedItems = normalizeItems(items);
  const { subtotal, deliveryCharge, total } = totals(normalizedItems);

  const order = await Order.create({
    user: req.user.id,
    items: normalizedItems,
    address,
    paymentMethod: paymentMethod === "ONLINE" ? "ONLINE" : "COD",
    paymentStatus: "paid",
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    subtotal,
    deliveryCharge,
    total
  });

  res.status(201).json({ success: true, data: order });
}

