import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ToolCard({ tool, departmentSlug }) {
  return (
    <Link
      to={`/department/${departmentSlug}/tool/${tool.id}`}
      className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl hover:bg-[#f8f6f3] transition-all duration-300 shadow-sm border border-[#dac2af]/10"
    >
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 bg-[#fff3e0] flex items-center justify-center rounded-xl text-[#E28616] text-2xl shrink-0">
          {tool.icon}
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className="text-lg font-extrabold text-[#221a13] group-hover:text-[#8c4f00] transition-colors">{tool.name}</h4>
            <StatusBadge status={tool.status} />
          </div>
          {tool.description && (
            <p className="text-[#544435] text-sm mt-1 max-w-lg">{tool.description}</p>
          )}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[#544435] text-[10px] font-bold uppercase tracking-widest bg-[#f0ebe4] px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-3 shrink-0">
        <span className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-[#f0ebe4] text-[#7f552c] hover:bg-[#E28616] hover:text-white rounded-xl transition-all">
          Open Tool
        </span>
      </div>
    </Link>
  );
}
