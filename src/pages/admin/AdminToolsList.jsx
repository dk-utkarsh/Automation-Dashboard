import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import StatusBadge from "../../components/StatusBadge";

export default function AdminToolsList() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDepartment = async () => {
    try {
      const departments = await api.getDepartments();
      const dept = departments.find((d) => d.id === Number(id));
      if (!dept) throw new Error("Department not found");
      const fullDept = await api.getDepartment(dept.slug);
      setDepartment(fullDept);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDepartment(); }, [id]);

  const handleDelete = async (toolId, toolName) => {
    if (!confirm(`Delete "${toolName}"?`)) return;
    try {
      await api.deleteTool(toolId);
      loadDepartment();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-3 border-[#E28616] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!department) return <p className="text-red-600 font-bold">Department not found</p>;

  return (
    <div className="animate-fade-up">
      <Link to="/admin" className="text-[#544435] hover:text-[#8c4f00] text-sm font-bold mb-6 inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{department.icon}</span>
          <h2 className="text-2xl font-black text-[#221a13]">{department.name} — Tools</h2>
        </div>
        <Link
          to={`/admin/departments/${id}/tools/new`}
          className="kinetic-gradient text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          + Add Tool
        </Link>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#dac2af]/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0ebe4]">
              <th className="text-left text-[#544435] text-[10px] font-black uppercase tracking-widest px-6 py-4">Tool</th>
              <th className="text-left text-[#544435] text-[10px] font-black uppercase tracking-widest px-6 py-4">Status</th>
              <th className="text-left text-[#544435] text-[10px] font-black uppercase tracking-widest px-6 py-4 hidden md:table-cell">URL</th>
              <th className="text-right text-[#544435] text-[10px] font-black uppercase tracking-widest px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {department.tools?.map((tool) => (
              <tr key={tool.id} className="border-b border-[#f0ebe4]/50 hover:bg-[#f8f6f3] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className="text-[#221a13] font-bold">{tool.name}</div>
                      <div className="text-[#877363] text-xs">{tool.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><StatusBadge status={tool.status} /></td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-[#8c4f00] hover:text-[#E28616] text-xs truncate block max-w-[200px]">{tool.url}</a>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/departments/${id}/tools/${tool.id}/edit`} className="text-[#544435] hover:text-[#221a13] text-xs font-bold uppercase tracking-wider">Edit</Link>
                    <button onClick={() => handleDelete(tool.id, tool.name)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!department.tools || department.tools.length === 0) && (
          <p className="text-[#877363] text-center py-10 font-medium">No tools yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
