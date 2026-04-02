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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl kinetic-gradient flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
            <span className="text-white font-black text-2xl italic">D</span>
          </div>
          <h1 className="text-2xl font-black text-[#221a13]">Admin Login</h1>
          <p className="text-[#877363] text-sm mt-1">Sign in to manage the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#544435] text-xs font-bold uppercase tracking-widest mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full bg-white border border-[#dac2af]/30 rounded-xl px-4 py-3 text-[#221a13] placeholder-[#877363] focus:outline-none focus:border-[#E28616] focus:ring-2 focus:ring-[#E28616]/10 transition-all"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-[#544435] text-xs font-bold uppercase tracking-widest mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-[#dac2af]/30 rounded-xl px-4 py-3 pr-12 text-[#221a13] placeholder-[#877363] focus:outline-none focus:border-[#E28616] focus:ring-2 focus:ring-[#E28616]/10 transition-all"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#877363] hover:text-[#8c4f00] transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full kinetic-gradient text-white font-black py-3 rounded-xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 disabled:opacity-50 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
