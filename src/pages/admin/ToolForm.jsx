import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function ToolForm() {
  const { id: departmentId, toolId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(toolId);
  const [form, setForm] = useState({ name: "", description: "", url: "", icon: "🔧", status: "live", tags: "", managed_by: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.getTool(toolId).then(tool => setForm({ name: tool.name, description: tool.description || "", url: tool.url, icon: tool.icon, status: tool.status, tags: (tool.tags || []).join(", "), managed_by: tool.managed_by || "" }))
      .catch(console.error).finally(() => setLoading(false));
  }, [toolId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, department_id: Number(departmentId), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      if (isEdit) await api.updateTool(toolId, data); else await api.createTool(data);
      navigate(`/admin/departments/${departmentId}/tools`);
    } catch (err) { alert("Failed: " + err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-10 h-10 border-3 border-[#FF8C00] border-t-transparent rounded-full animate-spin" /></div>;

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[#1A1C1E] placeholder-slate-400 focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/10 transition-all";

  return (
    <div className="max-w-lg">
      <Link to={`/admin/departments/${departmentId}/tools`} className="text-slate-500 hover:text-[#0A2E4D] text-sm font-medium mb-6 inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Apps
      </Link>
      <h2 className="text-2xl font-extrabold text-[#0A2E4D] mb-6">{isEdit ? "Edit App" : "New App"}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={inputClass} placeholder="e.g. Invoice Generator" /></div>
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">URL *</label><input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} required className={inputClass} placeholder="https://your-app.vercel.app/" /></div>
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className={inputClass + " resize-none"} placeholder="What does this app do?" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Icon</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className={inputClass} /></div>
          <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputClass}><option value="live">Live</option><option value="beta">Beta</option><option value="down">Down</option></select></div>
        </div>
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Tags (comma-separated)</label><input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputClass} placeholder="e.g. finance, daily" /></div>
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Managed By</label><input type="text" value={form.managed_by} onChange={e => setForm({...form, managed_by: e.target.value})} className={inputClass} placeholder="e.g. Rahul Sharma" /></div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#FF8C00] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-wide text-sm">{saving ? "Saving..." : isEdit ? "Update" : "Create"}</button>
          <Link to={`/admin/departments/${departmentId}/tools`} className="bg-white text-slate-600 font-bold px-6 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-wide text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
