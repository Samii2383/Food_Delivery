import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal.jsx";
import { adminApi } from "../../features/admin/adminApi.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Pagination from "../../components/ui/Pagination.jsx";

const initialForm = {
  restaurant: "",
  name: "",
  description: "",
  category: "",
  price: 100,
  isAvailable: true,
  image: null
};

export default function AdminFoodsPage() {
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [restaurants, setRestaurants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [foodsRes, restaurantsRes] = await Promise.all([
        adminApi.listFoods({ page, limit: 10 }),
        adminApi.listRestaurants({ page: 1, limit: 200 })
      ]);
      setFoods(foodsRes.data || []);
      setTotalPages(foodsRes.pagination?.totalPages || 1);
      setRestaurants(restaurantsRes.data || []);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      load().catch((err) => toast.error(err?.response?.data?.message || "Failed to load"));
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (editing) await adminApi.updateFood(editing._id, form);
      else await adminApi.createFood(form);
      setOpen(false);
      setEditing(null);
      setForm(initialForm);
      await load();
      toast.success("Saved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Foods</h1>
        <button
          onClick={() => {
            setEditing(null);
            setForm(initialForm);
            setOpen(true);
          }}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Add food
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12">
          <Spinner />
        </div>
      ) : null}
      {!loading ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Restaurant</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f._id} className="border-t border-slate-100">
                <td className="px-4 py-3">{f.name}</td>
                <td className="px-4 py-3">{f.restaurant?.name || "-"}</td>
                <td className="px-4 py-3">{f.category}</td>
                <td className="px-4 py-3">Rs {f.price}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(f);
                        setForm({
                          restaurant: f.restaurant?._id || f.restaurant,
                          name: f.name,
                          description: f.description || "",
                          category: f.category,
                          price: f.price,
                          isAvailable: f.isAvailable,
                          image: null
                        });
                        setOpen(true);
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await adminApi.deleteFood(f._id);
                        await load();
                        toast.success("Deleted");
                      }}
                      className="rounded-lg border border-rose-200 px-3 py-1 text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : null}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {open ? (
        <Modal title={editing ? "Edit food" : "Add food"} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-3">
            <select className="w-full rounded-xl border border-slate-200 px-3 py-2" value={form.restaurant} onChange={(e) => setForm((p) => ({ ...p, restaurant: e.target.value }))}>
              <option value="">Select restaurant</option>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
            <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <input type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))} />
              Available
            </label>
            <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save</button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

