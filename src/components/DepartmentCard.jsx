import { Link } from "react-router-dom";

const iconMap = {
  "accounts": "account_balance",
  "content": "edit_note",
  "creation": "palette",
  "waldent": "medical_services",
  "reports": "assessment",
};

export default function DepartmentCard({ department, featured = false }) {
  const materialIcon = iconMap[department.slug] || "folder";

  if (featured) {
    return (
      <Link
        to={`/department/${department.slug}`}
        className="md:col-span-2 relative group overflow-hidden rounded-xl bg-[#001E4D] shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="h-full w-full p-8 text-white flex flex-col justify-between min-h-[260px]">
          <div className="flex justify-between items-start">
            <div className="bg-[#FF8C00] p-3 rounded-lg shadow-lg">
              <span className="material-symbols-outlined text-3xl">{materialIcon}</span>
            </div>
            <span className="text-xs font-bold border border-white/30 px-3 py-1 rounded-full uppercase tracking-tight">
              Primary Hub
            </span>
          </div>
          <div className="mt-12">
            <h3 className="text-3xl font-black mb-2">{department.icon} {department.name}</h3>
            <p className="text-slate-300 text-sm max-w-xs mb-6">{department.description}</p>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-2xl font-bold">{department.tool_count || 0}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tools</div>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Status</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF8C00]" />
      </Link>
    );
  }

  return (
    <Link
      to={`/department/${department.slug}`}
      className="glass-card rounded-xl p-8 shadow-sm flex flex-col justify-between hover:border-[#FF8C00]/50 transition-all duration-200 group"
    >
      <div className="flex justify-between">
        <span className="material-symbols-outlined text-[#001E4D] text-3xl group-hover:scale-110 transition-transform">
          {materialIcon}
        </span>
        <span className="text-[#001E4D] font-bold text-xl">{department.tool_count || 0}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#001E4D] mt-6">{department.icon} {department.name}</h3>
        <p className="text-slate-500 text-xs mt-1 uppercase font-semibold">
          {department.tool_count || 0} Tools
        </p>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF8C00] rounded-full transition-all duration-700"
            style={{ width: `${Math.min(((department.tool_count || 0) / 10) * 100, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
