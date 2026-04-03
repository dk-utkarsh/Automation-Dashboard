import { motion } from "motion/react";

export function LightPullThemeSwitcher({ onToggle }) {
  return (
    <div className="relative py-4 px-3 overflow-hidden flex flex-col items-center">
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
        className="relative bottom-0 w-7 h-7 rounded-full cursor-grab
             bg-[radial-gradient(circle_at_center,_#facc15,_#fcd34d,_#fef9c3)]
             dark:bg-[radial-gradient(circle_at_center,_#4b5563,_#1f2937,_#000)]
             shadow-[0_0_20px_8px_rgba(250,204,21,0.5)]
             dark:shadow-[0_0_20px_6px_rgba(31,41,55,0.7)]
             z-10"
      >
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-0.5 h-[9999px] bg-neutral-300 dark:bg-neutral-700" />
      </motion.div>
      <p className="text-[9px] text-neutral-400 dark:text-neutral-600 mt-2 uppercase tracking-widest font-semibold select-none">
        Pull
      </p>
    </div>
  );
}
