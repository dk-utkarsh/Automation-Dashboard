import { Outlet } from "react-router-dom";

export default function AdminLayout({ onLogout }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#8c4f00]">Administration</span>
          <h1 className="text-3xl font-black tracking-tight text-[#221a13] mt-1">Admin Panel</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-[#544435] hover:text-[#8c4f00] text-xs font-black uppercase tracking-widest px-5 py-2.5 border border-[#dac2af]/30 rounded-xl hover:bg-white transition-all"
        >
          Logout
        </button>
      </div>
      <Outlet />
    </div>
  );
}
