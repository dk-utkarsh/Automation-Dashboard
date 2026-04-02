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
        <div className="w-10 h-10 border-3 border-[#E28616] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="text-[#8c4f00] mt-4 inline-block hover:underline font-bold">Back to Dashboard</Link>
      </div>
    );
  }

  const liveCount = department.tools?.filter(t => t.status === "live").length || 0;
  const totalTools = department.tools?.length || 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-10 animate-fade-up">
        <span className="text-[#544435] text-[11px] uppercase tracking-widest font-bold">Department View</span>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#221a13] mt-2 flex items-center gap-4">
          <span>{department.icon}</span> {department.name}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-[#3a5f94] font-medium text-sm">
          <Link to="/" className="hover:text-[#E28616] transition-colors">
            <span className="material-symbols-outlined text-sm align-middle">dashboard</span> Hub
          </Link>
          <span className="material-symbols-outlined text-sm text-[#877363]">chevron_right</span>
          <span className="text-[#544435]">{department.name}</span>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="col-span-1 md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-[#dac2af]/10 animate-fade-up stagger-1">
          <p className="text-[#544435] text-[11px] uppercase font-bold tracking-widest">Available Tools</p>
          <h3 className="text-4xl font-extrabold text-[#221a13] mt-3">{totalTools} Active</h3>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-2 flex-grow bg-[#f0ebe4] rounded-full overflow-hidden">
              <div
                className="h-full kinetic-gradient rounded-full"
                style={{ width: totalTools > 0 ? `${(liveCount / totalTools) * 100}%` : "0%" }}
              />
            </div>
            <span className="text-xs font-bold text-[#8c4f00]">{liveCount} Live</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dac2af]/10 flex flex-col justify-between animate-fade-up stagger-2">
          <span className="material-symbols-outlined text-[#E28616] text-3xl">verified</span>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#221a13]">{liveCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#544435]">Live Tools</div>
          </div>
        </div>
        <div className="kinetic-gradient text-white p-6 rounded-2xl shadow-xl shadow-orange-500/10 flex flex-col justify-between animate-fade-up stagger-3">
          <span className="material-symbols-outlined text-white/60 text-3xl">speed</span>
          <div className="mt-4">
            <div className="text-3xl font-black flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Active
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">System Status</div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-6 animate-fade-up stagger-4">
          <div>
            <h4 className="text-2xl font-bold tracking-tight text-[#221a13]">Automation Tools</h4>
            <p className="text-[#544435] text-sm mt-1">{department.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {department.tools?.map((tool, i) => (
            <div key={tool.id} className={`animate-fade-up stagger-${Math.min(i + 4, 6)}`}>
              <ToolCard tool={tool} departmentSlug={slug} />
            </div>
          ))}
        </div>

        {(!department.tools || department.tools.length === 0) && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#dac2af]/10">
            <span className="material-symbols-outlined text-5xl text-[#dac2af]">build</span>
            <p className="text-[#877363] mt-3 font-medium">No tools in this department yet.</p>
            <p className="text-[#877363] text-sm">Add tools from the Admin panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}
