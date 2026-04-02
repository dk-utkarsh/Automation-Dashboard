import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import StatusBadge from "../components/StatusBadge";
import IframeViewer from "../components/IframeViewer";

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <Link to={`/department/${slug}`} className="text-indigo-400 mt-4 inline-block hover:underline">
          Back to Department
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#1a1a2e] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/department/${slug}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <span className="text-lg">{tool.icon}</span>
          <div>
            <h2 className="text-white font-semibold text-sm">{tool.name}</h2>
            <span className="text-gray-500 text-xs">{tool.department_name}</span>
          </div>
          <StatusBadge status={tool.status} />
        </div>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1"
        >
          Open in new tab &#8599;
        </a>
      </div>

      <IframeViewer url={tool.url} title={tool.name} />
    </div>
  );
}
