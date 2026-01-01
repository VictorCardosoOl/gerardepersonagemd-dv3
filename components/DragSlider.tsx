
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const DragSlider: React.FC<Props> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative w-full group overflow-hidden ${className}`} ref={containerRef}>
      {/* Visual Hint Overlay */}
      <div className="absolute -top-6 right-0 text-xs text-stone-500 font-mono tracking-widest uppercase animate-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Arraste para explorar &rarr;
      </div>

      <motion.div
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.1}
        className="flex gap-6 py-4 px-2 cursor-grab active:cursor-grabbing w-max"
        whileTap={{ cursor: "grabbing" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
