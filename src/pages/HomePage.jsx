import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import DepartmentCard from "../components/DepartmentCard";

export default function HomePage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDepartments()
      .then(setDepartments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Failed to load: {error}</p>
      </div>
    );
  }

  const totalTools = departments.reduce((sum, d) => sum + (d.tool_count || 0), 0);
  const featured = departments[0];
  const rest = departments.slice(1);

  return (
    <div className="px-8 py-10 md:px-16">
      {/* Hero Stats Segment */}
      <div className="mb-12">
        <div className="flex items-end justify-between mb-8 animate-fade-up">
          <div>
            <p className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">Corporate Overview</p>
            <h2 className="text-4xl font-extrabold text-[#001E4D] tracking-tight">Departmental Hub</h2>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-black text-[#FF8C00]">{totalTools}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Total Active Tools</div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured && (
            <div className="md:col-span-2 lg:col-span-2 animate-fade-up stagger-1">
              <DepartmentCard department={featured} featured />
            </div>
          )}
          {rest.map((dept, i) => (
            <div key={dept.id} className={`animate-fade-up stagger-${Math.min(i + 2, 6)}`}>
              <DepartmentCard department={dept} />
            </div>
          ))}
        </div>
      </div>

      {departments.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
          <p className="text-slate-500 mt-4">No departments yet. Add some from the admin panel.</p>
        </div>
      )}

      {/* Enterprise Insights */}
      {departments.length > 0 && (
        <div className="mt-12 bg-white rounded-2xl p-10 border border-slate-200 flex flex-col md:flex-row gap-12 items-center shadow-sm animate-fade-up stagger-6">
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-[#001E4D] mb-4">Enterprise Insights</h4>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-lg">
              The central interface provides a real-time snapshot of cross-departmental automation tools.
              Access any department to manage and launch tools deployed across Vercel and Streamlit.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-[#001E4D] uppercase tracking-tight">Live Systems Operational</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
