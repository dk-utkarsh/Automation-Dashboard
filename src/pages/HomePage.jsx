import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { GlowCard } from "../components/ui/SpotlightCard";
import AnimatedNumber from "../components/AnimatedNumber";
import { SkeletonCard } from "../components/SkeletonCards";

const iconMap = {
  accounts: "account_balance",
  content: "edit_note",
  creation: "palette",
  waldent: "medical_services",
  reports: "assessment",
};

export default function HomePage({ darkMode }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDepartments()
      .then(setDepartments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Failed to load: {error}</p>
      </div>
    );
  }

  const totalTools = departments.reduce((sum, d) => sum + (d.tool_count || 0), 0);
  const totalDepts = departments.length;
  const liveTools = departments.reduce((sum, d) => sum + (d.tool_count || 0), 0);

  return (
    <div className="px-6 py-8 md:px-12 lg:px-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 animate-fade-up">
        <div>
          <p className={`font-semibold text-sm mb-1 uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Corporate Overview</p>
          <Link to="/" className="text-4xl font-extrabold tracking-tight gradient-text hover:opacity-80 transition-opacity">
            Departmental Hub
          </Link>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-up stagger-1`}>
        <div className={`rounded-xl px-5 py-4 ${darkMode ? "bg-white/5" : "bg-white"} border ${darkMode ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Departments</p>
          <p className={`text-2xl font-black mt-1 ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}><AnimatedNumber value={totalDepts} /></p>
        </div>
        <div className={`rounded-xl px-5 py-4 ${darkMode ? "bg-white/5" : "bg-white"} border ${darkMode ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Total Tools</p>
          <p className={`text-2xl font-black mt-1 text-[#FF8C00]`}><AnimatedNumber value={totalTools} /></p>
        </div>
        <div className={`rounded-xl px-5 py-4 ${darkMode ? "bg-white/5" : "bg-white"} border ${darkMode ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Live Tools</p>
          <p className="text-2xl font-black mt-1 text-green-500"><AnimatedNumber value={liveTools} /></p>
        </div>
        <div className="rounded-xl px-5 py-4 bg-[#0A2E4D] text-white">
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/50">System</p>
          <p className="text-lg font-black mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> All Live
          </p>
        </div>
      </div>

      {/* Department Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {departments.map((dept, i) => (
            <Link key={dept.id} to={`/department/${dept.slug}`} className={`block animate-fade-up stagger-${Math.min(i + 2, 8)}`}>
              <GlowCard glowColor="orange" className={`p-7 flex flex-col justify-between min-h-[190px] premium-card cursor-pointer ${darkMode ? "!bg-[#1e293b]/60" : ""}`}>
                <div className="flex justify-between relative z-10">
                  <span className={`material-symbols-outlined text-2xl ${darkMode ? "text-[#FF8C00]" : "text-[#0A2E4D]"}`}>
                    {iconMap[dept.slug] || "folder"}
                  </span>
                  <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>{dept.tool_count || 0}</span>
                </div>
                <div className="relative z-10">
                  <h3 className={`text-base font-bold mt-5 ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>{dept.name}</h3>
                  <p className={`text-xs mt-1 uppercase font-semibold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Total Tools</p>
                  <div className={`mt-3 h-1.5 w-full rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-slate-100"}`}>
                    <div className="h-full bg-[#FF8C00] rounded-full transition-all duration-1000" style={{ width: `${Math.min(((dept.tool_count || 0) / 10) * 100, 100)}%` }} />
                  </div>
                </div>
              </GlowCard>
            </Link>
          ))}
        </div>
      )}

      {!loading && departments.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
          <p className="text-slate-500 mt-4">No departments yet. Add some from the admin panel.</p>
        </div>
      )}

      {/* Live Dentalkart.com */}
      {!loading && departments.length > 0 && (
        <div className={`rounded-2xl border shadow-sm overflow-hidden animate-fade-up stagger-6 ${darkMode ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-200"}`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-[#334155]" : "border-slate-100"}`}>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Dentalkart" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <h4 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>Dentalkart.com</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Live</span>
                </div>
              </div>
            </div>
            <a href="https://www.dentalkart.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#FF8C00] hover:text-orange-600 flex items-center gap-1">
              Open full site <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
          <iframe src="https://www.dentalkart.com" title="Dentalkart.com Live" className="w-full border-0" style={{ height: "500px" }} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        </div>
      )}
    </div>
  );
}
