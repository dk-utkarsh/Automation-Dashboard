import { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentForm from "./pages/admin/DepartmentForm";
import AdminToolsList from "./pages/admin/AdminToolsList";
import ToolForm from "./pages/admin/ToolForm";
import LoginPage from "./pages/admin/LoginPage";
import { isLoggedIn, clearToken, api } from "./lib/api";

function Sidebar({ departments }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const iconMap = {
    accounts: "account_balance",
    content: "edit_note",
    creation: "palette",
    waldent: "medical_services",
    reports: "assessment",
  };

  return (
    <aside className="h-screen w-72 fixed left-0 border-r border-slate-200 bg-white hidden md:flex flex-col py-6 z-40">
      <div className="px-6 mb-10 flex items-center gap-3">
        <img src="/logo.png" alt="Dentalkart" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <h2 className="text-base font-black text-[#0A2E4D] leading-tight">Dentalkart</h2>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Automation Hub</span>
        </div>
      </div>
      <nav className="flex flex-col gap-y-1 flex-1">
        {departments.map((dept) => {
          const isActive = location.pathname === `/department/${dept.slug}`;
          const icon = iconMap[dept.slug] || "folder";
          return (
            <Link
              key={dept.id}
              to={`/department/${dept.slug}`}
              className={`mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-500/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {dept.icon} {dept.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 mt-auto">
        <Link
          to="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isAdmin
              ? "bg-[#0A2E4D] text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <span className="material-symbols-outlined">admin_panel_settings</span>
          Admin Panel
        </Link>
      </div>
    </aside>
  );
}

function TopBar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="w-full top-0 sticky z-30 bg-[#0A2E4D] text-white shadow-md flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Dentalkart" className="w-9 h-9 rounded-full object-cover border-2 border-white/20" />
        <h1 className="text-xl font-bold tracking-tight">
          {isAdmin ? "Admin Panel" : "Dentalkart Hub"}
        </h1>
      </div>
      <div className="flex-1 max-w-xl mx-12 hidden md:block">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#FF8C00] transition-colors">search</span>
          <input
            className="w-full bg-white/10 border-none rounded-lg py-2.5 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[#FF8C00]/50 transition-all font-medium placeholder:text-white/40 text-white outline-none"
            placeholder="Search projects, departments..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-white/70 hover:bg-white/10 rounded-full transition-colors active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <Link to="/" className="md:hidden p-2 text-white/70 hover:bg-white/10 rounded-full transition-colors">
          <span className="material-symbols-outlined">dashboard</span>
        </Link>
      </div>
    </header>
  );
}

function MainLayout({ departments }) {
  return (
    <>
      <Sidebar departments={departments} />
      <div className="md:ml-72 min-h-screen">
        <TopBar />
        <Outlet />
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

  useEffect(() => {
    const handleExpired = () => setLoggedIn(false);
    window.addEventListener("auth-expired", handleExpired);
    return () => window.removeEventListener("auth-expired", handleExpired);
  }, []);

  useEffect(() => {
    api.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = async () => {
    await api.logout().catch(() => {});
    clearToken();
    setLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Routes>
        <Route element={<MainLayout departments={departments} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/department/:slug" element={<DepartmentPage />} />

          <Route path="/admin/login" element={
            loggedIn ? <Navigate to="/admin" replace /> : <LoginPage onLogin={handleLogin} />
          } />

          <Route path="/admin" element={
            <ProtectedRoute loggedIn={loggedIn}>
              <AdminLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="departments/new" element={<DepartmentForm />} />
            <Route path="departments/:id/edit" element={<DepartmentForm />} />
            <Route path="departments/:id/tools" element={<AdminToolsList />} />
            <Route path="departments/:id/tools/new" element={<ToolForm />} />
            <Route path="departments/:id/tools/:toolId/edit" element={<ToolForm />} />
          </Route>
        </Route>
      </Routes>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] rounded-t-3xl">
        <Link to="/" className="text-[#FF8C00] rounded-full p-3 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">dashboard</span>
        </Link>
        <Link to="/admin" className="text-slate-400 p-3 hover:text-[#0A2E4D] active:scale-90 transition-transform">
          <span className="material-symbols-outlined">admin_panel_settings</span>
        </Link>
      </nav>
    </div>
  );
}
