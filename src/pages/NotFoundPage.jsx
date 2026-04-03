import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h2 className="text-2xl font-bold text-[#0A2E4D] mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#FF8C00] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-orange-500/20 transition-all active:scale-95 uppercase tracking-wide text-sm"
        >
          <span className="material-symbols-outlined text-lg">home</span>
          Back to Hub
        </Link>
      </div>
    </div>
  );
}
