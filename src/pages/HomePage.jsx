import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { CardStack } from "../components/ui/CardStack";
import AnimatedNumber from "../components/AnimatedNumber";
import { SkeletonCard } from "../components/SkeletonCards";

const iconMap = {
  accounts: "account_balance",
  content: "edit_note",
  creation: "palette",
  waldent: "medical_services",
  reports: "assessment",
};

const deptImages = {
  accounts: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  content: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
  creation: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
  waldent: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop",
  reports: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
};

export default function HomePage({ darkMode }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  const liveTools = totalTools;

  // Build CardStack items from departments
  const cardItems = departments.map((dept) => ({
    id: dept.id,
    title: `${dept.icon} ${dept.name}`,
    description: dept.description || `${dept.tool_count || 0} automation tools`,
    imageSrc: deptImages[dept.slug] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    href: null,
    slug: dept.slug,
    tool_count: dept.tool_count || 0,
  }));

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-up stagger-1">
        <div className={`rounded-xl px-5 py-4 ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100"} border`}>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Departments</p>
          <p className={`text-2xl font-black mt-1 ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}><AnimatedNumber value={totalDepts} /></p>
        </div>
        <div className={`rounded-xl px-5 py-4 ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100"} border`}>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Total Tools</p>
          <p className="text-2xl font-black mt-1 text-[#FF8C00]"><AnimatedNumber value={totalTools} /></p>
        </div>
        <div className={`rounded-xl px-5 py-4 ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100"} border`}>
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

      {/* Department Card Stack */}
      {!loading && departments.length > 0 && (
        <div className="mb-10 animate-fade-up stagger-2">
          <CardStack
            items={cardItems}
            initialIndex={0}
            autoAdvance
            intervalMs={3000}
            pauseOnHover
            showDots
            cardWidth={480}
            cardHeight={280}
            overlap={0.5}
            spreadDeg={40}
            renderCard={(item, { active }) => (
              <div
                className="relative h-full w-full group"
                onClick={(e) => {
                  if (active) {
                    e.stopPropagation();
                    navigate(`/department/${item.slug}`);
                  }
                }}
              >
                <div className="absolute inset-0">
                  <img src={item.imageSrc} alt={item.title} className="h-full w-full object-cover" draggable={false} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${active ? "bg-[#FF8C00] text-white" : "bg-white/20 text-white/80"}`}>
                      {item.tool_count} Tools
                    </span>
                    {active && (
                      <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors">
                        arrow_forward
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{item.title}</div>
                    <div className="mt-1 text-sm text-white/70">{item.description}</div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
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
        <div className={`rounded-2xl border shadow-sm overflow-hidden animate-fade-up stagger-6 ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-white/10" : "border-slate-100"}`}>
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
