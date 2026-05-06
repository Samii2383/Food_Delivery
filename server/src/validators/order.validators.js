import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  qty: z.coerce.number().int().positive()
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  address: z.object({
    fullName: z.string().trim().min(2),
    phone: z.string().trim().min(7),
    line1: z.string().trim().min(3),
    line2: z.string().trim().optional().default(""),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    pincode: z.string().trim().min(4)
  }),
  paymentMethod: z.enum(["COD", "ONLINE"]).default("COD")
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Preparing", "Out for delivery", "Delivered"])
});

