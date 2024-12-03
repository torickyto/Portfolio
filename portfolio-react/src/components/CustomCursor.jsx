import { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const currentPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrame;

    const updateCursor = () => {
      const smoothing = 0.15;
      
      const dx = targetPosition.current.x - currentPosition.current.x;
      const dy = targetPosition.current.y - currentPosition.current.y;
      
      currentPosition.current.x += dx * smoothing;
      currentPosition.current.y += dy * smoothing;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentPosition.current.x}px, ${currentPosition.current.y}px)`;
      }

      animationFrame = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = (e) => {
      if (e.target.matches('button, a, .project-button, .logo')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    updateCursor();

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor mix-blend-difference fixed pointer-events-none z-[9999]">
      <div 
        className={`cursor-dot bg-white rounded-full absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${
          isHovering ? 'scale-150' : 'scale-100'
        }`} 
      />
      <div 
        className={`cursor-ring border-2 border-white rounded-full absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${
          isHovering ? 'scale-150' : 'scale-100'
        }`}
      />
    </div>
  );
};

export default CustomCursor;