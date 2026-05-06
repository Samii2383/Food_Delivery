import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import EmptyState from "../components/EmptyState";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  if (items.length === 0) {
    return <EmptyState title="Nothing to checkout" subtitle="Your cart is empty." />;
  }

  function ensureRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      setError("Please fill all required address fields.");
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "COD") {
        await orderService.createOrder({
          items,
          total: subtotal + 49,
          address,
          paymentMethod: "COD"
        });
        clearCart();
        toast.success("Order placed (Cash on Delivery)");
        navigate("/orders");
        return;
      }

      const sdkLoaded = await ensureRazorpayScript();
      if (!sdkLoaded) throw new Error("Razorpay SDK failed to load");

      const orderRes = await paymentService.createRazorpayOrder({
        items,
        address,
        paymentMethod: "ONLINE"
      });

      const rpData = orderRes?.data;
      if (!rpData?.orderId || !rpData?.key) throw new Error("Invalid payment order response");

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: rpData.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: rpData.amount,
          currency: rpData.currency || "INR",
          name: "QuickBite",
          description: "Food order payment",
          order_id: rpData.orderId,
          // Razorpay test card: 4111 1111 1111 1111 / any future expiry / any CVV.
          handler: async (response) => {
            try {
              await paymentService.verifyRazorpayPayment({
                ...response,
                items,
                address,
                paymentMethod: "ONLINE"
              });
              resolve(true);
            } catch (verifyErr) {
              reject(verifyErr);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled"))
          },
          prefill: {
            name: address.fullName,
            contact: address.phone
          },
          theme: { color: "#fc8019" }
        });

        rzp.on("payment.failed", (resp) => {
          reject(new Error(resp?.error?.description || "Payment failed"));
        });
        rzp.open();
      });

      clearCart();
      toast.success("Payment successful. Order placed!");
      navigate("/orders");
    } catch (err) {
      // Debug logs for payload/verification mismatch diagnosis
      console.error("[Checkout] payment/order failed", {
        paymentMethod,
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data
      });
      setError(err?.response?.data?.message || "Failed to place order");
      toast.error(err?.response?.data?.message || err?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setPaymentMethod("ONLINE")}
          className={[
            "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
            paymentMethod === "ONLINE" ? "border-orange-300 bg-orange-50 text-orange-800" : "border-orange-200 bg-white text-slate-700"
          ].join(" ")}
        >
          Online Payment
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("COD")}
          className={[
            "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
            paymentMethod === "COD" ? "border-orange-300 bg-orange-50 text-orange-800" : "border-orange-200 bg-white text-slate-700"
          ].join(" ")}
        >
          Cash on Delivery
        </button>
      </div>
      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={placeOrder}>
        {[
          ["fullName", "Full name"],
          ["phone", "Phone"],
          ["city", "City"],
          ["state", "State"],
          ["pincode", "Pincode"]
        ].map(([key, label]) => (
          <input
            key={key}
            className="rounded-xl border border-orange-200 px-4 py-3 outline-none ring-orange-200/60 focus:ring-2"
            placeholder={label}
            value={address[key]}
            onChange={(e) => setAddress((p) => ({ ...p, [key]: e.target.value }))}
          />
        ))}
        <input
          className="rounded-xl border border-orange-200 px-4 py-3 outline-none ring-orange-200/60 focus:ring-2 sm:col-span-2"
          placeholder="Address line 1"
          value={address.line1}
          onChange={(e) => setAddress((p) => ({ ...p, line1: e.target.value }))}
        />
        <input
          className="rounded-xl border border-orange-200 px-4 py-3 outline-none ring-orange-200/60 focus:ring-2 sm:col-span-2"
          placeholder="Address line 2"
          value={address.line2}
          onChange={(e) => setAddress((p) => ({ ...p, line2: e.target.value }))}
        />
        {error ? <p className="text-sm text-rose-600 sm:col-span-2">{error}</p> : null}
        <button
          disabled={loading}
          className="brand-gradient rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:col-span-2 disabled:opacity-70"
        >
          {loading ? "Processing..." : paymentMethod === "ONLINE" ? "Pay & Place order" : "Place order (COD)"}
        </button>
      </form>
    </div>
  );
}

