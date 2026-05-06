import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import DashboardTable from "../../components/admin/DashboardTable";
import ModalForm from "../../components/admin/ModalForm";
import { restaurantService } from "../../services/restaurantService";

function inputClass() {
  return "admin-input w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm outline-none ring-orange-200/60 transition focus:ring-2";
}

export default function AdminRestaurants() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    rating: "4.2",
    deliveryTimeMins: "30",
    image: null
  });

  async function load() {
    try {
      setLoading(true);
      const res = await restaurantService.getRestaurants({ page: 1, limit: 50 });
      setRows(res?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function onCreate() {
    try {
      setBusy(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("rating", form.rating);
      fd.append("deliveryTimeMins", form.deliveryTimeMins);
      if (form.image) fd.append("image", form.image);

      await restaurantService.createRestaurant(fd);
      toast.success("Restaurant created");
      setOpen(false);
      setForm({ name: "", description: "", category: "", rating: "4.2", deliveryTimeMins: "30", image: null });
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create restaurant");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Delete this restaurant?");
    if (!ok) return;
    try {
      await restaurantService.deleteRestaurant(id);
      toast.success("Restaurant deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete restaurant");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "rating", label: "Rating" },
    { key: "delivery", label: "Delivery (mins)" },
    { key: "actions", label: "Actions" }
  ];

  return (
    <div>
      <DashboardTable
        title="Restaurants"
        subtitle="Create and manage restaurants."
        columns={columns}
        rows={rows}
        emptyText="No restaurants available. Add your first one to get started."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:brightness-110"
          >
            <Plus size={15} />
            Add Restaurant
          </button>
        }
        renderRow={(r) => (
          <tr key={r._id} className="text-slate-700 transition hover:bg-slate-50/80">
            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{r.name}</td>
            <td className="whitespace-nowrap px-5 py-4">{r.category || "-"}</td>
            <td className="whitespace-nowrap px-5 py-4">{r.rating ?? "-"}</td>
            <td className="whitespace-nowrap px-5 py-4">{r.deliveryTimeMins ?? "-"}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <button
                onClick={() => onDelete(r._id)}
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
          Loading restaurants...
        </motion.p>
      ) : null}

      <ModalForm
        open={open}
        title="Add Restaurant"
        subtitle="Upload an image (optional) and fill details."
        submitLabel="Create"
        busy={busy}
        onClose={() => setOpen(false)}
        onSubmit={onCreate}
      >
        <div>
          <label className="text-xs font-semibold text-slate-700">Name</label>
          <input
            className={inputClass()}
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="e.g. Spice Hub"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Category</label>
          <input
            className={inputClass()}
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            placeholder="e.g. Indian"
          />
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-700">Rating</label>
            <input
              className={inputClass()}
              value={form.rating}
              onChange={(e) => setForm((s) => ({ ...s, rating: e.target.value }))}
              placeholder="4.5"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Delivery Time (mins)</label>
            <input
              className={inputClass()}
              value={form.deliveryTimeMins}
              onChange={(e) => setForm((s) => ({ ...s, deliveryTimeMins: e.target.value }))}
              placeholder="30"
            />
          </div>
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

