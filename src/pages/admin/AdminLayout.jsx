import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage departments and tools</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
