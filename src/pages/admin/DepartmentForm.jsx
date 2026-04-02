import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function DepartmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: "", icon: "📁", color: "#6366f1, #8b5cf6", description: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.getDepartments().then(depts => {
      const dept = depts.find(d => d.id === Number(id));
      if (dept) setForm({ name: dept.name, icon: dept.icon, color: dept.color, description: dept.description || "" });
    }).catch(console.error).finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await api.updateDepartment(id, form); else await api.createDepartment(form);
      navigate("/admin");
    } catch (err) { alert("Failed: " + err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-10 h-10 border-3 border-[#FF8C00] border-t-transparent rounded-full animate-spin" /></div>;

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[#1A1C1E] placeholder-slate-400 focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/10 transition-all";

  return (
    <div className="max-w-lg">
      <Link to="/admin" className="text-slate-500 hover:text-[#3B8FCF] text-sm font-medium mb-6 inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back
      </Link>
      <h2 className="text-2xl font-extrabold text-[#3B8FCF] mb-6">{isEdit ? "Edit Department" : "New Department"}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={inputClass} placeholder="e.g. Accounts" /></div>
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Icon (emoji)</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className={inputClass} placeholder="e.g. 🏦" /></div>
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Gradient Colors</label><input type="text" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className={inputClass} placeholder="e.g. #6366f1, #8b5cf6" /></div>
        <div><label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className={inputClass + " resize-none"} placeholder="Short description" /></div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#FF8C00] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-wide text-sm">{saving ? "Saving..." : isEdit ? "Update" : "Create"}</button>
          <Link to="/admin" className="bg-white text-slate-600 font-bold px-6 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-wide text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
