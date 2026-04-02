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
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!department) {
    return <p className="text-red-400">Department not found</p>;
  }

  return (
    <div>
      <Link to="/admin" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">&larr; Back</Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{department.icon}</span>
          <h2 className="text-xl font-bold text-white">{department.name} — Tools</h2>
        </div>
        <Link
          to={`/admin/departments/${id}/tools/new`}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Tool
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Tool</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Status</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">URL</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {department.tools?.map((tool) => (
              <tr key={tool.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className="text-white font-medium">{tool.name}</div>
                      <div className="text-gray-500 text-xs">{tool.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={tool.status} />
                </td>
                <td className="px-6 py-4">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm truncate block max-w-xs">
                    {tool.url}
                  </a>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/departments/${id}/tools/${tool.id}/edit`}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tool.id, tool.name)}
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

        {(!department.tools || department.tools.length === 0) && (
          <p className="text-gray-500 text-center py-8">No tools yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
