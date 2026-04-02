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
    if (!confirm("This will seed the database with default departments and tools. Continue?")) return;

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
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/departments/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Department
        </Link>
        {departments.length === 0 && (
          <button
            onClick={handleSeed}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Seed Default Data
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Department</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Tools</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dept.icon}</span>
                    <div>
                      <div className="text-white font-medium">{dept.name}</div>
                      <div className="text-gray-500 text-xs">{dept.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {dept.tool_count || 0} tools
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/departments/${dept.id}/tools`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      Manage Tools
                    </Link>
                    <Link
                      to={`/admin/departments/${dept.id}/edit`}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(dept.id, dept.name)}
                      className="text-red-400 hover:text-red-300 text-sm"
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
          <p className="text-gray-500 text-center py-8">No departments yet. Add one or seed default data.</p>
        )}
      </div>
    </div>
  );
}
