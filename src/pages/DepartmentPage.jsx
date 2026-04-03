import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import ToolCard from "../components/ToolCard";

const deptThemes = {
  accounts: {
    gradient: "linear-gradient(135deg, #0f766e 0%, #065f46 40%, #022c22 100%)",
    accent: "#10b981",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=400&fit=crop",
  },
  content: {
    gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 40%, #1e1b4b 100%)",
    accent: "#a78bfa",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=400&fit=crop",
  },
  creation: {
    gradient: "linear-gradient(135deg, #db2777 0%, #9d174d 40%, #500724 100%)",
    accent: "#f472b6",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop",
  },
  waldent: {
    gradient: "linear-gradient(135deg, #0891b2 0%, #155e75 40%, #042f2e 100%)",
    accent: "#22d3ee",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=400&fit=crop",
  },
  reports: {
    gradient: "linear-gradient(135deg, #ea580c 0%, #9a3412 40%, #431407 100%)",
    accent: "#fb923c",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop",
  },
  logistics: {
    gradient: "linear-gradient(135deg, #2563eb 0%, #1e40af 40%, #172554 100%)",
    accent: "#60a5fa",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=400&fit=crop",
  },
};

const defaultTheme = {
  gradient: "linear-gradient(135deg, #0A2E4D 0%, #0f172a 100%)",
  accent: "#FF8C00",
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
};

export default function DepartmentPage({ darkMode }) {
  const { slug } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const theme = deptThemes[slug] || defaultTheme;

  const loadDepartment = (deptPassword) => {
    setLoading(true);
    setError(null);
    api.getDepartment(slug, deptPassword || sessionStorage.getItem(`dept_${slug}`))
      .then((data) => { setDepartment(data); setNeedsPassword(false); })
      .catch((err) => {
        if (err.message === "Password required") setNeedsPassword(true);
        else setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDepartment(); }, [slug]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setVerifying(true);
    try {
      await api.verifyDepartment(slug, password);
      sessionStorage.setItem(`dept_${slug}`, password);
      loadDepartment(password);
    } catch (err) { setAuthError(err.message); }
    finally { setVerifying(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="text-[#0A2E4D] mt-4 inline-block hover:underline font-bold">Back to Dashboard</Link>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl" style={{ background: theme.gradient }}>
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0A2E4D]">Protected Department</h2>
            <p className="text-slate-500 text-sm mt-1">Enter the password to access</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm font-medium">{authError}</div>
            )}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Department Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus
                  className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-12 py-3 text-[#1A1C1E] placeholder-slate-400 focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/10 transition-all text-sm"
                  placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0A2E4D] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={verifying}
              className="w-full text-white font-bold py-3 rounded-lg shadow-lg disabled:opacity-50 transition-all active:scale-[0.98] uppercase tracking-wide text-sm flex items-center justify-center gap-2"
              style={{ background: theme.gradient }}>
              {verifying ? "Verifying..." : <>Unlock <ArrowRight className="w-4 h-4" /></>}
            </button>
            <Link to="/" className="block text-center text-slate-500 hover:text-[#0A2E4D] text-sm font-medium mt-4">Back to Dashboard</Link>
          </form>
        </div>
      </div>
    );
  }

  const totalTools = department.tools?.length || 0;
  const liveCount = department.tools?.filter(t => t.status === "live").length || 0;

  return (
    <div className="min-h-screen">
      {/* Hero Banner with department-specific gradient */}
      <div className="relative overflow-hidden" style={{ background: theme.gradient }}>
        <img src={theme.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

        <div className="relative px-8 py-12 md:px-16 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-white transition-colors font-medium">Hub</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-white font-semibold">{department.name}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-center gap-4">
            <span className="text-4xl">{department.icon}</span> {department.name}
          </h2>
          {department.description && (
            <p className="text-white/70 mt-3 text-lg max-w-xl">{department.description}</p>
          )}

          {/* Stats inside hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Total Tools</p>
              <p className="text-3xl font-black text-white mt-1">{totalTools}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Live</p>
              <p className="text-3xl font-black mt-1" style={{ color: theme.accent }}>{liveCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Progress</p>
              <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ background: theme.accent, width: totalTools > 0 ? `${(liveCount / totalTools) * 100}%` : "0%" }} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Status</p>
              <p className="text-lg font-black mt-1 text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.accent }} /> Operational
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="px-8 py-10 md:px-16 max-w-[1400px] mx-auto">
        <div className="space-y-4">
          {department.tools?.map((tool, i) => (
            <div key={tool.id} className={`animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>

        {totalTools === 0 && (
          <div className="text-center py-16 glass-card rounded-xl">
            <span className="material-symbols-outlined text-5xl text-slate-300">build</span>
            <p className="text-slate-500 mt-3 font-medium">No tools in this department yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
