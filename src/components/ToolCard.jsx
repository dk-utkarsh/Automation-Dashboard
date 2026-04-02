import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ToolCard({ tool, departmentSlug }) {
  return (
    <Link
      to={`/department/${departmentSlug}/tool/${tool.id}`}
      className="glass-card rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FF8C00]/50 transition-all group"
    >
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 bg-[#F4F7FA] flex items-center justify-center rounded-xl text-2xl shrink-0">
          {tool.icon}
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className="text-base font-bold text-[#001E4D] group-hover:text-[#FF8C00] transition-colors">{tool.name}</h4>
            <StatusBadge status={tool.status} />
          </div>
          {tool.description && (
            <p className="text-slate-500 text-sm mt-1 max-w-lg">{tool.description}</p>
          )}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tool.tags.map((tag) => (
                <span key={tag} className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest bg-[#F4F7FA] px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <span className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-[#F4F7FA] text-[#001E4D] hover:bg-[#FF8C00] hover:text-white rounded-lg transition-all shrink-0">
        Open Tool
      </span>
    </Link>
  );
}
