import { Order } from "../models/Order.js";
import { ApiError } from "../utils/apiError.js";

const DELIVERY_CHARGE = 49;

export async function createOrder(req, res) {
  const items = req.body.items.map((item) => ({
    foodId: item.id,
    name: item.name,
    price: item.price,
    qty: item.qty
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryCharge = subtotal > 0 ? DELIVERY_CHARGE : 0;
  const total = subtotal + deliveryCharge;

  const order = await Order.create({
    user: req.user.id,
    items,
    address: req.body.address,
    paymentMethod: req.body.paymentMethod || "COD",
    paymentStatus: req.body.paymentMethod === "ONLINE" ? "pending" : "pending",
    subtotal,
    deliveryCharge,
    total
  });

  res.status(201).json({ success: true, data: order });
}

export async function getMyOrders(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const filter = { user: req.user.id };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter)
  ]);
  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

export async function getAllOrders(_req, res) {
  const page = Math.max(Number(_req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(_req.query.limit) || 20, 1), 100);
  const filter = {};
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter)
  ]);
  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

export async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = req.body.status;
  await order.save();

  res.json({ success: true, data: order });
}

