const statusConfig = {
  live: { label: "Live", color: "text-green-700", bg: "bg-green-50" },
  beta: { label: "Beta", color: "text-orange-700", bg: "bg-orange-50" },
  down: { label: "Down", color: "text-red-700", bg: "bg-red-50" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.live;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  );
}
