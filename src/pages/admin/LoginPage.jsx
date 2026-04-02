import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveToken } from "../../lib/api";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, username: user } = await api.login(username, password);
      saveToken(token);
      onLogin(user);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[#1A1C1E] placeholder-slate-400 focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/10 transition-all";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Dentalkart" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-xl" />
          <h1 className="text-2xl font-extrabold text-[#0A2E4D]">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus className={inputClass} placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass + " pr-12"}
                placeholder="Enter password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0A2E4D] transition-colors">
                <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8C00] hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all active:scale-[0.98] uppercase tracking-wide text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
