import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ToolCard({ tool, departmentSlug }) {
  const borderColors = {
    live: "border-l-green-500",
    beta: "border-l-yellow-500",
    down: "border-l-red-500",
  };

  return (
    <Link
      to={`/department/${departmentSlug}/tool/${tool.id}`}
      className={`block bg-white/5 border border-white/10 border-l-4 ${borderColors[tool.status] || borderColors.live} rounded-xl p-5 transition-all duration-200 hover:bg-white/10 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{tool.icon}</span>
        <StatusBadge status={tool.status} />
      </div>

      <h3 className="text-white font-semibold">{tool.name}</h3>

      {tool.description && (
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{tool.description}</p>
      )}

      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white/5 text-gray-400 text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
