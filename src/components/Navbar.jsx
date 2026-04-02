import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <span className="text-white font-bold text-lg">Dentalkart</span>
          <span className="text-indigo-400 text-sm hidden sm:inline">Automation Hub</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              !isAdmin ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin"
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              isAdmin ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
