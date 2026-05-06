import { Food } from "../models/Food.js";
import { Order } from "../models/Order.js";
import { Restaurant } from "../models/Restaurant.js";
import { User } from "../models/User.js";

export async function getDashboardStats(_req, res) {
  const [users, restaurants, foods, orders, pendingOrders, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    Food.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: { $ne: "Delivered" } }),
    Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$total" } } }])
  ]);

  res.json({
    success: true,
    data: {
      users,
      restaurants,
      foods,
      orders,
      pendingOrders,
      revenue: revenueAgg[0]?.totalRevenue || 0
    }
  });
}

