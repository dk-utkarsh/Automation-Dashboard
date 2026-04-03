import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Outlet, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { GradientBackground } from "./components/ui/GradientBackground";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentForm from "./pages/admin/DepartmentForm";
import AdminToolsList from "./pages/admin/AdminToolsList";
import ToolForm from "./pages/admin/ToolForm";
import LoginPage from "./pages/admin/LoginPage";
import { isLoggedIn, clearToken, api } from "./lib/api";

const iconMap = {
  accounts: "account_balance",
  content: "edit_note",
  creation: "palette",
  waldent: "medical_services",
  reports: "assessment",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right hidden lg:block">
      <div className="text-white/90 text-sm font-semibold">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      <div className="text-white/40 text-[10px] uppercase tracking-wider">{time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</div>
    </div>
  );
}

function Sidebar({ departments, darkMode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <aside className={`h-screen w-72 fixed left-0 border-r hidden md:flex flex-col py-6 z-40 transition-colors duration-300 ${darkMode ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-200"}`}>
      <Link to="/" className="px-6 mb-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Dentalkart" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <h2 className={`text-base font-black leading-tight ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>Dentalkart</h2>
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Automation Hub</span>
        </div>
      </Link>

      <div className={`px-6 mb-4 text-[10px] uppercase tracking-widest font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Departments</div>

      <nav className="flex flex-col gap-y-0.5 flex-1 overflow-y-auto px-2">
        {departments.map((dept) => {
          const isActive = location.pathname === `/department/${dept.slug}`;
          const icon = iconMap[dept.slug] || "folder";
          return (
            <Link
              key={dept.id}
              to={`/department/${dept.slug}`}
              className={`px-3 py-2.5 flex items-center gap-3 font-medium text-sm rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-500/20"
                  : darkMode ? "text-slate-400 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              <span className="flex-1">{dept.name}</span>
              <span className={`text-xs font-bold ${isActive ? "text-white/70" : darkMode ? "text-slate-600" : "text-slate-400"}`}>{dept.tool_count || 0}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-2">
        <Link
          to="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isAdmin
              ? "bg-[#0A2E4D] text-white"
              : darkMode ? "text-slate-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          Admin Panel
        </Link>
      </div>
    </aside>
  );
}

function TopBar({ departments, darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const results = search.trim().length > 0
    ? departments.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleSelect = (slug) => {
    navigate(`/department/${slug}`);
    setSearch("");
    setShowResults(false);
  };

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowResults(false);
        searchRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className={`topbar w-full top-0 sticky z-30 shadow-md flex items-center justify-between px-6 md:px-8 py-3 transition-colors duration-300 ${darkMode ? "bg-[#0f172a] text-white" : "bg-[#0A2E4D] text-white"}`}>
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Dentalkart" className="w-8 h-8 rounded-full object-cover border-2 border-white/20" />
        <div className="hidden sm:block">
          <h1 className="text-base font-bold tracking-tight leading-tight">
            {isAdmin ? "Admin Panel" : "Dentalkart Hub"}
          </h1>
          <p className="text-white/40 text-[10px]">{getGreeting()}</p>
        </div>
      </Link>

      <div className="flex-1 max-w-lg mx-4 md:mx-8 relative">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#FF8C00] transition-colors text-[20px]">search</span>
          <input
            ref={searchRef}
            className="w-full bg-white/10 border border-white/5 rounded-lg py-2 pl-10 pr-16 text-sm focus:ring-2 focus:ring-[#FF8C00]/50 focus:bg-white/15 transition-all font-medium placeholder:text-white/30 text-white outline-none"
            placeholder="Search departments..."
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5 font-mono hidden md:inline">⌘K</kbd>
        </div>
        {showResults && search.trim().length > 0 && (
          <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden z-50 ${darkMode ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-200"}`}>
            {results.length > 0 ? (
              results.map((dept) => (
                <button
                  key={dept.id}
                  onMouseDown={() => handleSelect(dept.slug)}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${darkMode ? "hover:bg-white/5" : "hover:bg-[#F4F7FA]"}`}
                >
                  <span className="text-xl">{dept.icon}</span>
                  <div>
                    <div className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#0A2E4D]"}`}>{dept.name}</div>
                    <div className="text-xs text-slate-500">{dept.tool_count || 0} tools</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-slate-400 text-sm">No departments found</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Clock />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-white/60 hover:bg-white/10 rounded-lg transition-colors"
          title="Toggle dark mode"
        >
          <span className="material-symbols-outlined text-[20px]">{darkMode ? "light_mode" : "dark_mode"}</span>
        </button>
        <Link to="/" className="md:hidden p-2 text-white/60 hover:bg-white/10 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
        </Link>
      </div>
    </header>
  );
}

function MainLayout({ departments, darkMode, setDarkMode }) {
  return (
    <>
      <Sidebar departments={departments} darkMode={darkMode} />
      <div className="md:ml-72 min-h-screen">
        <TopBar departments={departments} darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="page-enter">
          <Outlet />
        </div>
      </div>
    </>
  );
}

function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [departments, setDepartments] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleExpired = () => setLoggedIn(false);
    window.addEventListener("auth-expired", handleExpired);
    return () => window.removeEventListener("auth-expired", handleExpired);
  }, []);

  useEffect(() => {
    api.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const handleLogin = () => { setLoggedIn(true); toast.success("Logged in successfully"); };
  const handleLogout = async () => {
    await api.logout().catch(() => {});
    clearToken();
    setLoggedIn(false);
    toast("Logged out");
  };

  const content = (
    <>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route element={<MainLayout departments={departments} darkMode={darkMode} setDarkMode={setDarkMode} />}>
          <Route path="/" element={<HomePage darkMode={darkMode} />} />
          <Route path="/department/:slug" element={<DepartmentPage darkMode={darkMode} />} />

          <Route path="/admin/login" element={
            loggedIn ? <Navigate to="/admin" replace /> : <LoginPage onLogin={handleLogin} />
          } />

          <Route path="/admin" element={
            <ProtectedRoute loggedIn={loggedIn}>
              <AdminLayout onLogout={handleLogout} darkMode={darkMode} />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard darkMode={darkMode} />} />
            <Route path="departments/new" element={<DepartmentForm />} />
            <Route path="departments/:id/edit" element={<DepartmentForm />} />
            <Route path="departments/:id/tools" element={<AdminToolsList />} />
            <Route path="departments/:id/tools/new" element={<ToolForm />} />
            <Route path="departments/:id/tools/:toolId/edit" element={<ToolForm />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Mobile Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-3 backdrop-blur-xl border-t md:hidden shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] rounded-t-3xl ${darkMode ? "bg-black/60 border-white/10" : "bg-white/95 border-slate-200"}`}>
        <Link to="/" className="text-[#FF8C00] rounded-full p-3 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">dashboard</span>
        </Link>
        <Link to="/admin" className={`p-3 active:scale-90 transition-transform ${darkMode ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-[#0A2E4D]"}`}>
          <span className="material-symbols-outlined">admin_panel_settings</span>
        </Link>
      </nav>
    </>
  );

  if (darkMode) {
    return <GradientBackground>{content}</GradientBackground>;
  }

  return <div className="min-h-screen bg-[#F4F7FA]">{content}</div>;
}
