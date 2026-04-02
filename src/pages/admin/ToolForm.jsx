import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function ToolForm() {
  const { id: departmentId, toolId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(toolId);

  const [form, setForm] = useState({ name: "", description: "", url: "", icon: "🔧", status: "live", tags: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.getTool(toolId)
      .then((tool) => setForm({ name: tool.name, description: tool.description || "", url: tool.url, icon: tool.icon, status: tool.status, tags: (tool.tags || []).join(", ") }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [toolId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, department_id: Number(departmentId), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      if (isEdit) await api.updateTool(toolId, data);
      else await api.createTool(data);
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
        <div className="w-10 h-10 border-3 border-[#E28616] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-[#dac2af]/30 rounded-xl px-4 py-3 text-[#221a13] placeholder-[#877363] focus:outline-none focus:border-[#E28616] focus:ring-2 focus:ring-[#E28616]/10 transition-all";
  const labelClass = "block text-[#544435] text-xs font-bold uppercase tracking-widest mb-1.5";

  return (
    <div className="max-w-lg animate-fade-up">
      <Link to={`/admin/departments/${departmentId}/tools`} className="text-[#544435] hover:text-[#8c4f00] text-sm font-bold mb-6 inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Tools
      </Link>

      <h2 className="text-2xl font-black text-[#221a13] mb-6">{isEdit ? "Edit Tool" : "New Tool"}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} placeholder="e.g. Invoice Generator" />
        </div>
        <div>
          <label className={labelClass}>URL *</label>
          <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required className={inputClass} placeholder="https://your-app.vercel.app/" />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass + " resize-none"} placeholder="What does this tool do?" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Icon (emoji)</label>
            <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              <option value="live">Live</option>
              <option value="beta">Beta</option>
              <option value="down">Down</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="e.g. finance, daily, automation" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="kinetic-gradient text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-widest text-xs">
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <Link to={`/admin/departments/${departmentId}/tools`} className="bg-white text-[#7f552c] font-black px-6 py-3 rounded-xl border border-[#dac2af]/30 hover:bg-[#f0ebe4] transition-all uppercase tracking-widest text-xs">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
