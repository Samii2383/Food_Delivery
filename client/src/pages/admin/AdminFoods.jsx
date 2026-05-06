import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import DashboardTable from "../../components/admin/DashboardTable";
import ModalForm from "../../components/admin/ModalForm";
import { foodService } from "../../services/foodService";
import { restaurantService } from "../../services/restaurantService";

function inputClass() {
  return "admin-input w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm outline-none ring-orange-200/60 transition focus:ring-2";
}

export default function AdminFoods() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    restaurant: "",
    name: "",
    description: "",
    category: "",
    price: "199",
    isAvailable: true,
    image: null
  });

  async function load() {
    setLoading(true);
    const [foodsRes, restaurantsRes] = await Promise.allSettled([
      foodService.getFoods({ page: 1, limit: 60 }),
      restaurantService.getRestaurants({ page: 1, limit: 50 })
    ]);

    if (foodsRes.status === "fulfilled") {
      setRows(foodsRes.value?.data || []);
    } else {
      toast.error(foodsRes.reason?.response?.data?.message || "Failed to load foods");
    }

    if (restaurantsRes.status === "fulfilled") {
      setRestaurants(restaurantsRes.value?.data || []);
    } else {
      toast.error(restaurantsRes.reason?.response?.data?.message || "Failed to load restaurants");
    }

    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const restaurantOptions = useMemo(
    () => restaurants.map((x) => ({ id: x._id, name: x.name })),
    [restaurants]
  );

  function validateForm() {
    const next = {};
    const priceNum = Number(form.price);

    if (!form.restaurant) next.restaurant = "Please select a restaurant";
    if (!form.name.trim()) next.name = "Food name is required";
    if (!form.category.trim()) next.category = "Category is required";
    if (!Number.isFinite(priceNum) || priceNum <= 0) next.price = "Enter a valid price";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onCreate() {
    if (!validateForm()) return;

    try {
      setBusy(true);

      const price = String(Number(form.price));
      const fd = new FormData();

      // Support both payload variants used by different backends.
      fd.append("restaurant", form.restaurant);
      fd.append("restaurantId", form.restaurant);
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("price", price);
      fd.append("isAvailable", String(form.isAvailable));
      fd.append("available", String(form.isAvailable));
      if (form.image) fd.append("image", form.image);

      console.log("[AdminFoods] create payload", {
        restaurant: form.restaurant,
        restaurantId: form.restaurant,
        name: form.name,
        description: form.description,
        category: form.category,
        price,
        isAvailable: form.isAvailable,
        available: form.isAvailable,
        hasImage: Boolean(form.image)
      });

      await foodService.createFood(fd);
      toast.success("Food created");
      setOpen(false);
      setErrors({});
      setForm({
        restaurant: "",
        name: "",
        description: "",
        category: "",
        price: "199",
        isAvailable: true,
        image: null
      });
      await load();
    } catch (err) {
      console.error("[AdminFoods] create failed", {
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data
      });
      toast.error(err?.response?.data?.message || "Failed to create food");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Delete this food item?");
    if (!ok) return;
    try {
      await foodService.deleteFood(id);
      toast.success("Food deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete food");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "restaurant", label: "Restaurant" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "available", label: "Available" },
    { key: "actions", label: "Actions" }
  ];

  return (
    <div>
      <DashboardTable
        title="Foods"
        subtitle="Create and manage food items."
        columns={columns}
        rows={rows}
        emptyText="No food items found. Add menu items to begin."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:brightness-110"
          >
            <Plus size={15} />
            Add Food
          </button>
        }
        renderRow={(f) => (
          <tr key={f._id} className="text-slate-700 transition hover:bg-slate-50/80">
            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{f.name}</td>
            <td className="whitespace-nowrap px-5 py-4">{f.restaurant?.name || "-"}</td>
            <td className="whitespace-nowrap px-5 py-4">{f.category || "-"}</td>
            <td className="whitespace-nowrap px-5 py-4">₹{f.price}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  f.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                ].join(" ")}
              >
                {f.isAvailable ? "Yes" : "No"}
              </span>
            </td>
            <td className="whitespace-nowrap px-5 py-4">
              <button
                onClick={() => onDelete(f._id)}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Delete
              </button>
            </td>
          </tr>
        )}
      />

      {loading ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-slate-500">
          Loading foods...
        </motion.p>
      ) : null}

      <ModalForm
        open={open}
        title="Add Food"
        subtitle="Select a restaurant and add details."
        submitLabel="Create"
        busy={busy}
        onClose={() => setOpen(false)}
        onSubmit={onCreate}
      >
        <div>
          <label className="text-xs font-semibold text-slate-700">Restaurant</label>
          <select
            className={inputClass()}
            value={form.restaurant}
            onChange={(e) => setForm((s) => ({ ...s, restaurant: e.target.value }))}
            required
          >
            <option value="">Select restaurant</option>
            {restaurantOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.restaurant ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.restaurant}</p> : null}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Name</label>
          <input
            className={inputClass()}
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="e.g. Chicken Biryani"
            required
          />
          {errors.name ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <input
              className={inputClass()}
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              placeholder="e.g. Biryani"
            />
            {errors.category ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.category}</p> : null}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Price</label>
            <input
              className={inputClass()}
              value={form.price}
              onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
              placeholder="199"
              required
            />
            {errors.price ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.price}</p> : null}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            className={[inputClass(), "min-h-[90px]"].join(" ")}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            placeholder="Short description..."
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Available</p>
            <p className="text-xs text-slate-600">Toggle if this item is in stock.</p>
          </div>
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => setForm((s) => ({ ...s, isAvailable: e.target.checked }))}
            className="h-5 w-5 accent-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Image</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
            onChange={(e) => setForm((s) => ({ ...s, image: e.target.files?.[0] || null }))}
          />
        </div>
      </ModalForm>
    </div>
  );
}

