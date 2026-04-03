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
        <div className="w-10 h-10 border-3 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="text-[#0A2E4D] mt-4 inline-block hover:underline font-bold">Back to Dashboard</Link>
      </div>
    );
  }

  const totalTools = department.tools?.length || 0;
  const liveCount = department.tools?.filter(t => t.status === "live").length || 0;

  return (
    <div className="px-8 py-10 md:px-16 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:text-[#FF8C00] transition-colors font-medium">Hub</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#0A2E4D] font-semibold">{department.name}</span>
        </div>
        <h2 className="text-4xl font-extrabold text-[#0A2E4D] tracking-tight flex items-center gap-3">
          <span className="text-3xl">{department.icon}</span> {department.name}
        </h2>
        {department.description && (
          <p className="text-slate-500 mt-2">{department.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass-card rounded-xl p-6 animate-fade-up stagger-1">
          <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider">Total Tools</p>
          <p className="text-3xl font-black text-[#0A2E4D] mt-2">{totalTools}</p>
        </div>
        <div className="glass-card rounded-xl p-6 animate-fade-up stagger-2">
          <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider">Live</p>
          <p className="text-3xl font-black text-green-600 mt-2">{liveCount}</p>
        </div>
        <div className="glass-card rounded-xl p-6 animate-fade-up stagger-3">
          <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider">Progress</p>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF8C00] rounded-full" style={{ width: totalTools > 0 ? `${(liveCount / totalTools) * 100}%` : "0%" }} />
          </div>
        </div>
        <div className="bg-[#0A2E4D] rounded-xl p-6 text-white animate-fade-up stagger-4">
          <p className="text-white/60 text-xs uppercase font-semibold tracking-wider">Status</p>
          <p className="text-lg font-black mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Operational
          </p>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-4">
        {department.tools?.map((tool, i) => (
          <div key={tool.id} className={`animate-fade-up stagger-${Math.min(i + 4, 6)}`}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>

      {totalTools === 0 && (
        <div className="text-center py-16 glass-card rounded-xl">
          <span className="material-symbols-outlined text-5xl text-slate-300">build</span>
          <p className="text-slate-500 mt-3 font-medium">No tools in this department yet.</p>
        </div>
      )}
    </div>
  );
}
