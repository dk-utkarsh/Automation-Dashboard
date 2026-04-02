const statusConfig = {
  live: { label: "Live", color: "text-green-400", bg: "bg-green-400/10" },
  beta: { label: "Beta", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  down: { label: "Down", color: "text-red-400", bg: "bg-red-400/10" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.live;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.color} ${config.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
