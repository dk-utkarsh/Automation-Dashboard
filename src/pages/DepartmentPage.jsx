import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import ToolCard from "../components/ToolCard";
import AnimatedNumber from "../components/AnimatedNumber";

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
            <div className="w-16 h-16 rounded-2xl bg-[#0A2E4D] flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>Protected Department</h2>
            <p className="text-slate-500 text-sm mt-1">Enter the password to access</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {authError && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm font-medium">{authError}</div>}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus
                  className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-12 py-3 text-[#1A1C1E] placeholder-slate-400 focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/10 transition-all text-sm"
                  placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={verifying}
              className="w-full bg-[#FF8C00] hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all active:scale-[0.98] uppercase tracking-wide text-sm flex items-center justify-center gap-2">
              {verifying ? "Verifying..." : <>Unlock <ArrowRight className="w-4 h-4" /></>}
            </button>
            <Link to="/" className="block text-center text-slate-500 text-sm font-medium mt-4">Back to Dashboard</Link>
          </form>
        </div>
      </div>
    );
  }

  const totalTools = department.tools?.length || 0;
  const liveCount = department.tools?.filter(t => t.status === "live").length || 0;

  return (
    <div className="px-8 py-8 md:px-16 max-w-[1400px] mx-auto page-enter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 animate-fade-up">
        <Link to="/" className="hover:text-[#FF8C00] transition-colors font-medium">Hub</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className={`font-semibold ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>{department.name}</span>
      </div>

      {/* Department header */}
      <div className="mb-8 animate-fade-up stagger-1">
        <h2 className={`text-4xl font-extrabold tracking-tight flex items-center gap-3 ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>
          <span className="text-3xl">{department.icon}</span> {department.name}
        </h2>
        {department.description && <p className="text-slate-500 mt-2">{department.description}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className={`rounded-xl p-5 animate-fade-up stagger-2 border ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100"}`}>
          <p className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Total Tools</p>
          <p className={`text-3xl font-black mt-1 ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}><AnimatedNumber value={totalTools} /></p>
        </div>
        <div className={`rounded-xl p-5 animate-fade-up stagger-3 border ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100"}`}>
          <p className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Live</p>
          <p className="text-3xl font-black mt-1 text-green-500"><AnimatedNumber value={liveCount} /></p>
        </div>
        <div className={`rounded-xl p-5 animate-fade-up stagger-4 border ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100"}`}>
          <p className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Progress</p>
          <div className={`mt-3 h-2 w-full rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-slate-100"}`}>
            <div className="h-full bg-[#FF8C00] rounded-full transition-all duration-1000" style={{ width: totalTools > 0 ? `${(liveCount / totalTools) * 100}%` : "0%" }} />
          </div>
        </div>
        <div className="rounded-xl p-5 animate-fade-up stagger-5 bg-[#0A2E4D] text-white">
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">Status</p>
          <p className="text-lg font-black mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Operational
          </p>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-4">
        {department.tools?.map((tool, i) => (
          <div key={tool.id} className={`animate-fade-up stagger-${Math.min(i + 5, 8)}`}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>

      {totalTools === 0 && (
        <div className={`text-center py-16 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100"}`}>
          <span className="material-symbols-outlined text-5xl text-slate-300">build</span>
          <p className="text-slate-500 mt-3 font-medium">No tools in this department yet.</p>
        </div>
      )}
    </div>
  );
}
