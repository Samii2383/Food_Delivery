import { Food } from "../models/Food.js";
import { Restaurant } from "../models/Restaurant.js";
import { ApiError } from "../utils/apiError.js";
import { uploadImageToCloudinary } from "../middleware/upload.js";

export async function listFoods(req, res) {
  const { search = "", category = "", restaurantId = "", page = 1, limit = 20 } = req.query;
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 60);

  const filter = {};
  if (search) filter.$text = { $search: String(search) };
  if (category) filter.category = category;
  if (restaurantId) filter.restaurant = restaurantId;

  const [items, total] = await Promise.all([
    Food.find(filter).populate("restaurant", "name image").sort({ createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize),
    Food.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) }
  });
}

export async function getFoodById(req, res) {
  const item = await Food.findById(req.params.id).populate("restaurant", "name image");
  if (!item) throw new ApiError(404, "Food not found");
  res.json({ success: true, data: item });
}

export async function createFood(req, res) {
  const exists = await Restaurant.exists({ _id: req.body.restaurant });
  if (!exists) throw new ApiError(400, "Restaurant does not exist");

  const image = await uploadImageToCloudinary(req.file, "quickbite/foods");
  const item = await Food.create({
    restaurant: req.body.restaurant,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    isAvailable: req.body.isAvailable,
    image: image || undefined
  });

  res.status(201).json({ success: true, data: item });
}

export async function updateFood(req, res) {
  const item = await Food.findById(req.params.id);
  if (!item) throw new ApiError(404, "Food not found");

  if (req.body.restaurant) {
    const exists = await Restaurant.exists({ _id: req.body.restaurant });
    if (!exists) throw new ApiError(400, "Restaurant does not exist");
  }

  const image = await uploadImageToCloudinary(req.file, "quickbite/foods");
  Object.assign(item, {
    restaurant: req.body.restaurant ?? item.restaurant,
    name: req.body.name ?? item.name,
    description: req.body.description ?? item.description,
    category: req.body.category ?? item.category,
    price: req.body.price ?? item.price,
    isAvailable: req.body.isAvailable ?? item.isAvailable
  });
  if (image) item.image = image;
  await item.save();

  res.json({ success: true, data: item });
}

export async function deleteFood(req, res) {
  const deleted = await Food.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, "Food not found");
  res.json({ success: true, message: "Food deleted" });
}

