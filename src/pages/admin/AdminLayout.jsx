import { Outlet } from "react-router-dom";

export default function AdminLayout({ onLogout }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage departments and tools</p>
        </div>
        <button
          onClick={onLogout}
          className="text-gray-400 hover:text-white text-sm px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
        >
          Logout
        </button>
      </div>
      <Outlet />
    </div>
  );
}
