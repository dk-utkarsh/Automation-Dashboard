import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import StatusBadge from "../components/StatusBadge";

export default function ToolPage() {
  const { slug, toolId } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getTool(toolId)
      .then(setTool)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [toolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6f3]">
        <div className="w-10 h-10 border-3 border-[#E28616] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-[#f8f6f3] min-h-screen">
        <p className="text-red-600">{error}</p>
        <Link to={`/department/${slug}`} className="text-[#8c4f00] mt-4 inline-block hover:underline font-bold">
          Back to Department
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Tool top bar */}
      <header className="bg-[#82756b] px-6 py-3 flex items-center justify-between shadow-lg shadow-orange-900/5">
        <div className="flex items-center gap-4">
          <Link
            to={`/department/${slug}`}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </Link>
          <div className="h-5 w-px bg-white/20" />
          <span className="text-xl">{tool.icon}</span>
          <div>
            <h2 className="text-white font-bold text-sm">{tool.name}</h2>
            <span className="text-white/50 text-xs">{tool.department_name}</span>
          </div>
          <StatusBadge status={tool.status} />
        </div>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#E28616] text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#d47b02] transition-colors shadow-lg shadow-orange-500/20"
        >
          Open in new tab
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </header>

      <iframe
        src={tool.url}
        title={tool.name}
        className="w-full border-0"
        style={{ height: "calc(100vh - 56px)" }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
