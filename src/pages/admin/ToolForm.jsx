import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function ToolForm() {
  const { id: departmentId, toolId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(toolId);

  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    icon: "🔧",
    status: "live",
    tags: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    api.getTool(toolId)
      .then((tool) => {
        setForm({
          name: tool.name,
          description: tool.description || "",
          url: tool.url,
          icon: tool.icon,
          status: tool.status,
          tags: (tool.tags || []).join(", "),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [toolId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...form,
      department_id: Number(departmentId),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.updateTool(toolId, data);
      } else {
        await api.createTool(data);
      }
      navigate(`/admin/departments/${departmentId}/tools`);
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
      <Link to={`/admin/departments/${departmentId}/tools`} className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
        &larr; Back to Tools
      </Link>

      <h2 className="text-xl font-bold text-white mb-6">
        {isEdit ? "Edit Tool" : "New Tool"}
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
            placeholder="e.g. Invoice Generator"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">URL *</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="https://your-app.vercel.app/"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="What does this tool do?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Icon (emoji)</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="live">Live</option>
              <option value="beta">Beta</option>
              <option value="down">Down</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. finance, daily, automation"
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
            to={`/admin/departments/${departmentId}/tools`}
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
