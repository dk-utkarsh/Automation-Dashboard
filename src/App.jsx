import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import ToolPage from "./pages/ToolPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentForm from "./pages/admin/DepartmentForm";
import AdminToolsList from "./pages/admin/AdminToolsList";
import ToolForm from "./pages/admin/ToolForm";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Routes>
        {/* Tool page — full viewport, no navbar */}
        <Route path="/department/:slug/tool/:toolId" element={<ToolPage />} />

        {/* All other pages — with navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/department/:slug" element={<DepartmentPage />} />
          <Route path="/admin" element={<AdminLayout />}>
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
