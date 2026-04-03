import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { GlowCard } from "../components/ui/SpotlightCard";

const iconMap = {
  accounts: "account_balance",
  content: "edit_note",
  creation: "palette",
  waldent: "medical_services",
  reports: "assessment",
};

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
        <div className="w-8 h-8 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
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

  return (
    <div className="px-8 py-10 md:px-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">Corporate Overview</p>
          <h2 className="text-4xl font-extrabold text-[#0A2E4D] tracking-tight">Departmental Hub</h2>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-black text-[#FF8C00]">{totalTools}</div>
          <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Total Active Tools</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {departments.map((dept) => (
          <Link key={dept.id} to={`/department/${dept.slug}`} className="block">
            <GlowCard glowColor="orange" className="p-8 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <div className="flex justify-between relative z-10">
                <span className="material-symbols-outlined text-[#0A2E4D] text-3xl">
                  {iconMap[dept.slug] || "folder"}
                </span>
                <span className="text-[#0A2E4D] font-bold text-xl">{dept.tool_count || 0}</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-[#0A2E4D] mt-6">{dept.name}</h3>
                <p className="text-slate-500 text-xs mt-1 uppercase font-semibold">Total Tools</p>
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF8C00] rounded-full"
                    style={{ width: `${Math.min(((dept.tool_count || 0) / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
          <p className="text-slate-500 mt-4">No departments yet. Add some from the admin panel.</p>
        </div>
      )}

      {/* Live Dentalkart.com */}
      {departments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Dentalkart" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <h4 className="text-sm font-bold text-[#0A2E4D]">Dentalkart.com</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Live</span>
                </div>
              </div>
            </div>
            <a
              href="https://www.dentalkart.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#FF8C00] hover:text-orange-600 flex items-center gap-1"
            >
              Open full site <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
          <iframe
            src="https://www.dentalkart.com"
            title="Dentalkart.com Live"
            className="w-full border-0"
            style={{ height: "500px" }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      )}
    </div>
  );
}
