import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDepartments().then(setDepartments).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" and all its tools?`)) return;
    try { await api.deleteDepartment(id); setDepartments(prev => prev.filter(d => d.id !== id)); }
    catch (err) { alert("Failed: " + err.message); }
  };

  const handleSeed = async () => {
    if (!confirm("Seed database with default data?")) return;
    try { await api.seed(); setDepartments(await api.getDepartments()); alert("Seeded!"); }
    catch (err) { alert("Failed: " + err.message); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-10 h-10 border-3 border-[#FF8C00] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/departments/new" className="bg-[#FF8C00] hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all active:scale-95 uppercase tracking-wide">
          + Add Department
        </Link>
        {departments.length === 0 && (
          <button onClick={handleSeed} className="bg-white text-slate-600 text-sm font-bold px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
            Seed Default Data
          </button>
        )}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">Department</th>
              <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">Tools</th>
              <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider px-6 py-4 hidden md:table-cell">Password</th>
              <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept.id} className="border-b border-slate-50 hover:bg-[#F8FAFC] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dept.icon}</span>
                    <div>
                      <div className="text-[#0A2E4D] font-bold">{dept.name}</div>
                      <div className="text-slate-400 text-xs">{dept.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm font-medium">{dept.tool_count || 0} tools</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  {dept.has_password ? (
                    <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                      <span className="material-symbols-outlined text-sm">lock</span> Protected
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">No password</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link to={`/admin/departments/${dept.id}/tools`} className="text-[#FF8C00] hover:text-orange-600 text-sm font-semibold">Tools</Link>
                    <Link to={`/admin/departments/${dept.id}/edit`} className="text-slate-500 hover:text-[#0A2E4D] text-sm font-semibold">Edit</Link>
                    <button onClick={() => handleDelete(dept.id, dept.name)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {departments.length === 0 && <p className="text-slate-400 text-center py-10">No departments yet.</p>}
      </div>
    </div>
  );
}
