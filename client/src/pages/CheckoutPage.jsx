import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  clearCart,
  selectCartItems,
  selectCartSubtotal
} from "../features/cart/cartSlice.js";
import { createOrder } from "../features/orders/ordersApi.js";

const DELIVERY_CHARGE = 49;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useMemo(
    () => subtotal + (items.length > 0 ? DELIVERY_CHARGE : 0),
    [subtotal, items.length]
  );

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">No items to checkout</h1>
          <p className="mt-2 text-slate-600">Add food items to cart before placing an order.</p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error("Please complete all required address fields");
      return;
    }

    try {
      setSubmitting(true);
      await createOrder({
        items,
        address: form,
        paymentMethod: "COD"
      });
      dispatch(clearCart());
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-600">Cash on delivery only.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone number"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"]
            ].map(([key, label]) => (
              <input
                key={key}
                placeholder={label}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/30 focus:ring-2"
              />
            ))}
            <input
              placeholder="Address line 1"
              value={form.line1}
              onChange={(e) => setForm((prev) => ({ ...prev, line1: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/30 focus:ring-2 sm:col-span-2"
            />
            <input
              placeholder="Address line 2 (optional)"
              value={form.line2}
              onChange={(e) => setForm((prev) => ({ ...prev, line2: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/30 focus:ring-2 sm:col-span-2"
            />
          </div>

          <button
            disabled={submitting}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-70"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>
                  {item.name} x {item.qty}
                </span>
                <span>Rs {item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span>Rs {subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery</span>
              <span>Rs {DELIVERY_CHARGE}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

