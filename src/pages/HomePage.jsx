import { useState, useEffect } from "react";
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
        <div className="w-10 h-10 border-3 border-[#E28616] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Failed to load departments: {error}</p>
      </div>
    );
  }

  const totalTools = departments.reduce((sum, d) => sum + (d.tool_count || 0), 0);
  const featured = departments[0];
  const rest = departments.slice(1);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-up">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#8c4f00]">Corporate Overview</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#221a13] mt-1">
            Automation <span className="text-[#E28616] italic" style={{ fontFamily: "'Playfair Display', serif" }}>Hub</span>
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-black text-[#8c4f00]">{totalTools}</div>
          <div className="text-[10px] uppercase tracking-widest text-[#544435] font-bold">Total Active Tools</div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {featured && (
          <div className="animate-fade-up stagger-1">
            <DepartmentCard department={featured} featured />
          </div>
        )}
        {rest.map((dept, i) => (
          <div key={dept.id} className={`animate-fade-up stagger-${i + 2}`}>
            <DepartmentCard department={dept} />
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-[#dac2af]">inventory_2</span>
          <p className="text-[#877363] mt-4">No departments yet. Add some from the admin panel.</p>
        </div>
      )}

      {/* Enterprise Insights Footer */}
      {departments.length > 0 && (
        <div className="mt-12 bg-[#f0ebe4] rounded-3xl p-10 flex flex-col md:flex-row gap-10 items-center animate-fade-up stagger-6">
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-[#003366] mb-3">Enterprise Insights</h4>
            <p className="text-[#544435] leading-relaxed max-w-lg">
              The central interface provides a real-time snapshot of cross-departmental automation tools.
              Access any department to manage and launch tools deployed across Vercel and Streamlit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-[#003366]">All Systems Operational</span>
          </div>
        </div>
      )}
    </div>
  );
}
