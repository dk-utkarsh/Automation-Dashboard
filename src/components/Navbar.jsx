import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="w-full top-0 sticky z-50 bg-[#82756b] shadow-xl shadow-orange-900/5">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-[1400px] mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
            Dental<span className="text-[#E28616]">kart</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              !isAdmin
                ? "bg-[#E28616] text-white shadow-lg shadow-orange-500/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              isAdmin
                ? "bg-[#E28616] text-white shadow-lg shadow-orange-500/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E28616] to-[#d47b02] flex items-center justify-center text-white font-bold text-sm border-2 border-white/20">
            D
          </div>
        </div>
      </div>
    </header>
  );
}
