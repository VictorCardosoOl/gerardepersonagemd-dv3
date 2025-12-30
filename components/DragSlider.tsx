import React, { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const DragSlider: React.FC<Props> = ({ children, className = '' }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicador de velocidade (scroll-fast)
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Keyboard Accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!sliderRef.current) return;
      
      const scrollAmount = 300; // Step size
      if (e.key === 'ArrowRight') {
          sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
          sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
  };

  return (
    <div className={`relative w-full group ${className}`}>
      {/* Visual Hint Overlay */}
      <div className="absolute -top-6 right-0 text-xs text-stone-400 font-mono tracking-widest uppercase animate-pulse pointer-events-none">
        Drag or Use Arrows &rarr;
      </div>

      <div
        ref={sliderRef}
        tabIndex={0} // Make focusable
        className={`
            flex gap-6 overflow-x-auto no-scrollbar py-4 px-2
            cursor-grab active:cursor-grabbing select-none
            transition-all duration-300 outline-none focus:ring-2 focus:ring-mystic-300 rounded-xl
            ${isDown ? 'scale-[1.005]' : ''}
        `}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </div>
  );
};