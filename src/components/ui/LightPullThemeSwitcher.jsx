import { motion } from "motion/react";

export function LightPullThemeSwitcher({ onToggle, isDark }) {
  return (
    <div className="relative py-3 px-3 overflow-hidden flex flex-col items-center">
      <motion.div
        drag="y"
        dragDirectionLock
        onDragEnd={(event, info) => {
          if (info.offset.y > 30) {
            onToggle();
          }
        }}
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.075}
        whileDrag={{ cursor: "grabbing", scale: 1.2 }}
        whileHover={{ scale: 1.1 }}
        className="relative bottom-0 w-7 h-7 rounded-full cursor-grab z-10"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, #94a3b8, #475569, #1e293b)"
            : "radial-gradient(circle at center, #facc15, #fcd34d, #fef9c3)",
          boxShadow: isDark
            ? "0 0 16px 6px rgba(148,163,184,0.3)"
            : "0 0 20px 8px rgba(250,204,21,0.5)",
        }}
      >
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 w-0.5 h-[9999px]"
          style={{ background: isDark ? "#475569" : "#d4d4d4" }}
        />
      </motion.div>
      <p className="text-[9px] text-white/40 mt-1.5 uppercase tracking-widest font-semibold select-none">
        Pull
      </p>
    </div>
  );
}
