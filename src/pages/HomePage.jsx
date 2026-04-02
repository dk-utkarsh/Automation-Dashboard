import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

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
  const featured = departments[0];
  const rest = departments.slice(1);

  return (
    <div className="px-8 py-10 md:px-16">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">
              Corporate Overview
            </p>
            <h2 className="text-4xl font-extrabold text-[#001E4D] tracking-tight">
              Departmental Hub
            </h2>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-black text-[#FF8C00]">{totalTools}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              Total Active Tools
            </div>
          </div>
        </div>

        {/* Bento Grid — matches Stitch HTML exactly */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {/* Featured Card */}
          {featured && (
            <Link
              to={`/department/${featured.slug}`}
              className="md:col-span-2 lg:col-span-2 relative group overflow-hidden rounded-xl bg-[#001E4D] shadow-xl transition-transform hover:-translate-y-1"
            >
              <div className="h-full w-full p-8 text-white flex flex-col justify-between min-h-[280px]">
                <div className="flex justify-between items-start">
                  <div className="bg-[#FF8C00] p-3 rounded-lg shadow-lg">
                    <span className="material-symbols-outlined text-3xl">
                      {iconMap[featured.slug] || "folder"}
                    </span>
                  </div>
                  <span className="text-xs font-bold border border-white/30 px-3 py-1 rounded-full uppercase tracking-tight">
                    Primary Hub
                  </span>
                </div>
                <div className="mt-12">
                  <h3 className="text-3xl font-black mb-2">
                    {featured.icon} {featured.name}
                  </h3>
                  <p className="text-slate-300 text-sm max-w-xs mb-6">
                    {featured.description || "Primary department hub"}
                  </p>
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-2xl font-bold">{featured.tool_count || 0}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                        Tools
                      </div>
                    </div>
                    <div className="h-10 w-px bg-white/20" />
                    <div>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Live
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                        Status
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF8C00]" />
            </Link>
          )}

          {/* Regular Department Cards */}
          {rest.map((dept) => (
            <Link
              key={dept.id}
              to={`/department/${dept.slug}`}
              className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm flex flex-col justify-between hover:border-[#FF8C00]/50 hover:shadow-md transition-all group min-h-[200px]"
            >
              <div className="flex justify-between">
                <span className="material-symbols-outlined text-[#001E4D] text-3xl transition-transform group-hover:scale-110">
                  {iconMap[dept.slug] || "folder"}
                </span>
                <span className="text-[#001E4D] font-bold text-xl">
                  {dept.tool_count || 0}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#001E4D] mt-6">
                  {dept.icon} {dept.name}
                </h3>
                <p className="text-slate-500 text-xs mt-1 uppercase font-semibold">
                  Total Tools
                </p>
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF8C00] rounded-full"
                    style={{
                      width: `${Math.min(((dept.tool_count || 0) / 10) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {departments.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-300">
            inventory_2
          </span>
          <p className="text-slate-500 mt-4">
            No departments yet. Add some from the admin panel.
          </p>
        </div>
      )}

      {/* Enterprise Insights */}
      {departments.length > 0 && (
        <div className="mt-12 bg-white rounded-2xl p-10 border border-slate-200 flex flex-col md:flex-row gap-12 items-center shadow-sm">
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-[#001E4D] mb-4">
              Enterprise Insights
            </h4>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-lg">
              The central interface provides a real-time snapshot of cross-departmental
              automation tools. Access any department to manage and launch tools deployed
              across Vercel and Streamlit.
            </p>
            <button className="bg-[#FF8C00] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-[#FF8C00]/20 active:scale-95 transition-all uppercase tracking-wide text-sm">
              Generate Monthly Report
            </button>
          </div>
          <div className="w-full md:w-1/3 relative aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-[#001E4D]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/10 text-[120px]">
                monitoring
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-[#001E4D] uppercase tracking-tight">
                  Live Systems Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
