import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import ToolCard from "../components/ToolCard";

export default function DepartmentPage() {
  const { slug } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getDepartment(slug)
      .then(setDepartment)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <Link to="/" className="text-indigo-400 mt-4 inline-block hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link to="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6">
        <span>&larr;</span> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">{department.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-white">{department.name}</h1>
          {department.description && (
            <p className="text-gray-400 text-sm mt-1">{department.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {department.tools?.map((tool) => (
          <ToolCard key={tool.id} tool={tool} departmentSlug={slug} />
        ))}
      </div>

      {(!department.tools || department.tools.length === 0) && (
        <p className="text-gray-500 text-center py-12">No tools in this department yet.</p>
      )}
    </div>
  );
}
