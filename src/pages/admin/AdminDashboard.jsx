import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDepartments()
      .then(setDepartments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" and all its tools?`)) return;
    try {
      await api.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSeed = async () => {
    if (!confirm("Seed the database with default departments and tools?")) return;
    try {
      await api.seed();
      const data = await api.getDepartments();
      setDepartments(data);
      alert("Database seeded successfully!");
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-3 border-[#E28616] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up stagger-1">
        <Link
          to="/admin/departments/new"
          className="kinetic-gradient text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-95"
        >
          + Add Department
        </Link>
        {departments.length === 0 && (
          <button
            onClick={handleSeed}
            className="bg-white text-[#7f552c] text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border border-[#dac2af]/30 hover:bg-[#f0ebe4] transition-all"
          >
            Seed Default Data
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#dac2af]/10 animate-fade-up stagger-2">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0ebe4]">
              <th className="text-left text-[#544435] text-[10px] font-black uppercase tracking-widest px-6 py-4">Department</th>
              <th className="text-left text-[#544435] text-[10px] font-black uppercase tracking-widest px-6 py-4">Tools</th>
              <th className="text-right text-[#544435] text-[10px] font-black uppercase tracking-widest px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b border-[#f0ebe4]/50 hover:bg-[#f8f6f3] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dept.icon}</span>
                    <div>
                      <div className="text-[#221a13] font-bold">{dept.name}</div>
                      <div className="text-[#877363] text-xs">{dept.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#544435] text-sm font-medium">
                  {dept.tool_count || 0} tools
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/departments/${dept.id}/tools`}
                      className="text-[#8c4f00] hover:text-[#E28616] text-xs font-bold uppercase tracking-wider"
                    >
                      Tools
                    </Link>
                    <Link
                      to={`/admin/departments/${dept.id}/edit`}
                      className="text-[#544435] hover:text-[#221a13] text-xs font-bold uppercase tracking-wider"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(dept.id, dept.name)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {departments.length === 0 && (
          <p className="text-[#877363] text-center py-10 font-medium">No departments yet. Add one or seed default data.</p>
        )}
      </div>
    </div>
  );
}
