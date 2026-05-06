import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
  updateCartQuantity
} from "../features/cart/cartSlice.js";

const DELIVERY_CHARGE = 49;

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const total = useMemo(
    () => subtotal + (items.length > 0 ? DELIVERY_CHARGE : 0),
    [subtotal, items.length]
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-slate-100" />
          <h1 className="text-2xl font-semibold text-slate-900">Your cart is empty</h1>
          <p className="mt-2 text-slate-600">Looks like you have not added any food yet.</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Browse restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">Your cart</h1>
            <button
              onClick={() => {
                dispatch(clearCart());
                toast.success("Cart cleared");
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Clear cart
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="transform rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">Rs {item.price} each</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-xl border border-slate-200">
                    <button
                      onClick={() =>
                        dispatch(updateCartQuantity({ id: item.id, qty: item.qty - 1 }))
                      }
                      className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="min-w-10 px-3 text-center text-sm font-semibold">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(updateCartQuantity({ id: item.id, qty: item.qty + 1 }))
                      }
                      className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-slate-900">Rs {item.price * item.qty}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Bill summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span>Rs {subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery charges</span>
              <span>Rs {DELIVERY_CHARGE}</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span>Total</span>
                <span>Rs {total}</span>
              </div>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Proceed to checkout
          </Link>
          <Link
            to="/orders"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View order history
          </Link>
        </aside>
      </div>
    </div>
  );
}

