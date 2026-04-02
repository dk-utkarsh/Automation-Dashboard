import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="w-full top-0 sticky z-50 bg-[#001E4D] text-white shadow-md">
      <div className="flex items-center justify-between px-6 md:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white font-bold">
              D
            </div>
            <h1 className="text-xl font-bold tracking-tight">Dentalkart Hub</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !isAdmin
                ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isAdmin
                ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-white/70 hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
}
