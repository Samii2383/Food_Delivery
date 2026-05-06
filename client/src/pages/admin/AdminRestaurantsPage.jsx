import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal.jsx";
import { adminApi } from "../../features/admin/adminApi.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Pagination from "../../components/ui/Pagination.jsx";

const initialForm = { name: "", description: "", category: "", deliveryTimeMins: 30, rating: 4.2, image: null };

export default function AdminRestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.listRestaurants({ page, limit: 10 });
      setItems(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
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
      if (editing) await adminApi.updateRestaurant(editing._id, form);
      else await adminApi.createRestaurant(form);
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
        <h1 className="text-2xl font-semibold text-slate-900">Restaurants</h1>
        <button
          onClick={() => {
            setEditing(null);
            setForm(initialForm);
            setOpen(true);
          }}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Add restaurant
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
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id} className="border-t border-slate-100">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3">{r.deliveryTimeMins} min</td>
                <td className="px-4 py-3">{r.rating}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(r);
                        setForm({
                          name: r.name,
                          description: r.description || "",
                          category: r.category,
                          deliveryTimeMins: r.deliveryTimeMins,
                          rating: r.rating,
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
                        await adminApi.deleteRestaurant(r._id);
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
        <Modal title={editing ? "Edit restaurant" : "Add restaurant"} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-3">
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
            <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Delivery mins" value={form.deliveryTimeMins} onChange={(e) => setForm((p) => ({ ...p, deliveryTimeMins: Number(e.target.value) }))} />
              <input type="number" step="0.1" className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Rating" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))} />
            </div>
            <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save</button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

