import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function DepartmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    icon: "📁",
    color: "#6366f1, #8b5cf6",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    api.getDepartments()
      .then((departments) => {
        const dept = departments.find((d) => d.id === Number(id));
        if (dept) {
          setForm({ name: dept.name, icon: dept.icon, color: dept.color, description: dept.description || "" });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        await api.updateDepartment(id, form);
      } else {
        await api.createDepartment(form);
      }
      navigate("/admin");
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <Link to="/admin" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">&larr; Back</Link>

      <h2 className="text-xl font-bold text-white mb-6">
        {isEdit ? "Edit Department" : "New Department"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Accounts"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Icon (emoji)</label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 🏦"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Gradient Colors</label>
          <input
            type="text"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. #6366f1, #8b5cf6"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Short description of this department"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <Link
            to="/admin"
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
