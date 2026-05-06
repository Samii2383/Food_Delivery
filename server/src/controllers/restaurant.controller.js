import { Restaurant } from "../models/Restaurant.js";
import { ApiError } from "../utils/apiError.js";
import { uploadImageToCloudinary } from "../middleware/upload.js";

export async function listRestaurants(req, res) {
  const { search = "", category = "", page = 1, limit = 12 } = req.query;
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 50);

  const filter = {};
  if (search) filter.$text = { $search: String(search) };
  if (category) filter.category = category;

  const [items, total] = await Promise.all([
    Restaurant.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Restaurant.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) }
  });
}

export async function getRestaurantById(req, res) {
  const item = await Restaurant.findById(req.params.id);
  if (!item) throw new ApiError(404, "Restaurant not found");
  res.json({ success: true, data: item });
}

export async function createRestaurant(req, res) {
  const image = await uploadImageToCloudinary(req.file, "quickbite/restaurants");
  const item = await Restaurant.create({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    rating: req.body.rating,
    deliveryTimeMins: req.body.deliveryTimeMins,
    image: image || undefined
  });
  res.status(201).json({ success: true, data: item });
}

export async function updateRestaurant(req, res) {
  const item = await Restaurant.findById(req.params.id);
  if (!item) throw new ApiError(404, "Restaurant not found");

  const image = await uploadImageToCloudinary(req.file, "quickbite/restaurants");
  Object.assign(item, {
    name: req.body.name ?? item.name,
    description: req.body.description ?? item.description,
    category: req.body.category ?? item.category,
    rating: req.body.rating ?? item.rating,
    deliveryTimeMins: req.body.deliveryTimeMins ?? item.deliveryTimeMins
  });
  if (image) item.image = image;

  await item.save();
  res.json({ success: true, data: item });
}

export async function deleteRestaurant(req, res) {
  const deleted = await Restaurant.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, "Restaurant not found");
  res.json({ success: true, message: "Restaurant deleted" });
}

