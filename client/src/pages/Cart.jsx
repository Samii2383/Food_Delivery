import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import EmptyState from "../components/EmptyState";

const DELIVERY_CHARGE = 49;

export default function Cart() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const total = subtotal + (items.length > 0 ? DELIVERY_CHARGE : 0);

  if (items.length === 0) {
    return <EmptyState title="Cart is empty" subtitle="Add items from restaurants to continue." />;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{item.name}</h3>
              <button className="text-sm text-rose-600 hover:text-rose-700" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="inline-flex items-center rounded-lg border border-orange-200">
                <button className="px-3 py-2 hover:bg-orange-50" onClick={() => updateQuantity(item.id, item.qty - 1)}>
                  -
                </button>
                <span className="px-3">{item.qty}</span>
                <button className="px-3 py-2 hover:bg-orange-50" onClick={() => updateQuantity(item.id, item.qty + 1)}>
                  +
                </button>
              </div>
              <p className="font-semibold">Rs {item.qty * item.price}</p>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>Rs {subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery</span>
            <span>Rs {DELIVERY_CHARGE}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="brand-gradient mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Checkout
        </button>
        <Link to="/" className="mt-2 inline-block text-sm text-slate-600 underline">
          Add more items
        </Link>
      </aside>
    </section>
  );
}

