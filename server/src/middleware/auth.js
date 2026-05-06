import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../services/token.service.js";
import { User } from "../models/User.js";

export async function protect(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new ApiError(401, "Unauthorized");

    const token = header.slice("Bearer ".length).trim();
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).select("_id role");
    if (!user) throw new ApiError(401, "Unauthorized");

    req.user = { id: String(user._id), role: user.role };
    next();
  } catch (err) {
    next(err?.name === "JsonWebTokenError" ? new ApiError(401, "Unauthorized") : err);
  }
}

export function adminOnly(req, _res, next) {
  if (req.user?.role !== "admin") return next(new ApiError(403, "Admin access required"));
  next();
}

