import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { signAccessToken } from "../services/token.service.js";

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  const exists = await User.exists({ email });
  if (exists) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password });
  const token = signAccessToken({ userId: String(user._id), role: user.role });

  res.status(201).json({
    success: true,
    token,
    user: publicUser(user)
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid email or password");

  const token = signAccessToken({ userId: String(user._id), role: user.role });

  res.json({
    success: true,
    token,
    user: publicUser(user)
  });
}

export const registerUser = register;
export const loginUser = login;

