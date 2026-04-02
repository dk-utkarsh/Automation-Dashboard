const statusConfig = {
  live: { label: "Live", color: "text-green-700", bg: "bg-green-100" },
  beta: { label: "Beta", color: "text-amber-700", bg: "bg-[#fff3e0]" },
  down: { label: "Down", color: "text-red-700", bg: "bg-red-100" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.live;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  );
}
