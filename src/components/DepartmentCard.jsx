import { Link } from "react-router-dom";

export default function DepartmentCard({ department }) {
  const [fromColor, toColor] = department.color.split(", ");

  return (
    <Link
      to={`/department/${department.slug}`}
      className="group block rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10 border border-white/5"
      style={{
        background: `linear-gradient(135deg, ${fromColor}22, ${toColor}22)`,
        borderColor: `${fromColor}33`,
      }}
    >
      <div className="text-4xl mb-3">{department.icon}</div>
      <h3 className="text-white font-semibold text-lg">{department.name}</h3>
      <p className="text-gray-400 text-sm mt-1">{department.tool_count || 0} tools</p>
      {department.description && (
        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{department.description}</p>
      )}
    </Link>
  );
}
