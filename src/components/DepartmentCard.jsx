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
        className="md:col-span-2 relative group overflow-hidden rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div className="h-full w-full featured-gradient p-8 text-white flex flex-col justify-between min-h-[260px]">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
              <span className="material-symbols-outlined text-3xl">{materialIcon}</span>
            </div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm uppercase tracking-widest">
              Primary Hub
            </span>
          </div>
          <div className="mt-auto">
            <div className="text-3xl mb-1">{department.icon}</div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">{department.name}</h3>
            <p className="text-white/70 text-sm max-w-xs mb-6">{department.description}</p>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold">{department.tool_count || 0}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Tools</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Live
                </div>
                <div className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Status</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/department/${department.slug}`}
      className="glass-card rounded-2xl p-7 shadow-sm border border-[#dac2af]/15 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start">
        <span className="material-symbols-outlined text-[#8c4f00] text-3xl group-hover:scale-110 transition-transform">
          {materialIcon}
        </span>
        <span className="text-[#8c4f00] font-bold text-lg">{department.tool_count || 0}</span>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold text-[#221a13] flex items-center gap-2">
          <span>{department.icon}</span> {department.name}
        </h3>
        <p className="text-[#544435] text-xs mt-1">{department.description || "Department tools"}</p>
        <div className="mt-4 h-1.5 w-full bg-[#f0ebe4] rounded-full overflow-hidden">
          <div
            className="h-full kinetic-gradient rounded-full transition-all duration-700"
            style={{ width: `${Math.min(((department.tool_count || 0) / 10) * 100, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
