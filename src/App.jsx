import { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import ToolPage from "./pages/ToolPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentForm from "./pages/admin/DepartmentForm";
import AdminToolsList from "./pages/admin/AdminToolsList";
import ToolForm from "./pages/admin/ToolForm";
import LoginPage from "./pages/admin/LoginPage";
import { isLoggedIn, clearToken, api } from "./lib/api";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    const handleExpired = () => setLoggedIn(false);
    window.addEventListener("auth-expired", handleExpired);
    return () => window.removeEventListener("auth-expired", handleExpired);
  }, []);

  const handleLogin = () => setLoggedIn(true);

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    clearToken();
    setLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <Routes>
        <Route path="/department/:slug/tool/:toolId" element={<ToolPage />} />

        <Route element={<MainLayout />}>
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
    </div>
  );
}
