import { Outlet } from "react-router-dom";

export default function AdminLayout({ onLogout }) {
  return (
    <div className="px-8 py-10 md:px-16 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">Administration</p>
          <h2 className="text-3xl font-extrabold text-[#001E4D] tracking-tight">Admin Panel</h2>
        </div>
        <button
          onClick={onLogout}
          className="text-slate-500 hover:text-[#001E4D] text-sm font-medium px-4 py-2 border border-slate-200 rounded-lg hover:bg-white transition-all"
        >
          Logout
        </button>
      </div>
      <Outlet />
    </div>
  );
}
