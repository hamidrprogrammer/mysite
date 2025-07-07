import { useEffect, RefObject } from 'react';
import gsap from 'gsap';

interface UsePortfolioCursorProps {
  cursorRef: RefObject<HTMLDivElement>; // Ref to the cursor element itself
  activeAreaRef: RefObject<HTMLElement>; // Ref to the area where cursor should be active
  // text?: string; // Optional: text to display in the cursor
}

const usePortfolioCursor = ({
  cursorRef,
  activeAreaRef,
  // text = "SHOW",
}: UsePortfolioCursorProps) => {
  useEffect(() => {
    const cursor = cursorRef.current;
    const area = activeAreaRef.current;

    if (!cursor || !area) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 }); // Initial state: centered, hidden, slightly small

    const onMouseMove = (e: MouseEvent) => {
      // Get position relative to the activeAreaRef to avoid issues with page scroll
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if mouse is within the bounds of activeAreaRef
      // This check is important if activeAreaRef is not the full screen
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        gsap.to(cursor, {
            // Use clientX/Y for positioning relative to viewport if cursor is fixed
            // Or calculate position relative to area if cursor is child of area
            x: e.clientX, // If cursor is fixed positioned
            y: e.clientY, // If cursor is fixed positioned
            // x: x, // If cursor is absolute child of area and area is relative/absolute
            // y: y,
            duration: 0.1,
            ease: 'power2.out'
        });
      } else {
        // If mouse moves out of the defined area but still within the window (e.g. if area is smaller than window)
        // you might want to hide the cursor or handle it differently.
        // For now, this assumes mouseleave on 'area' will handle hiding.
      }
    };

    const onMouseEnterArea = () => {
      // cursor.textContent = text; // Set text if dynamic
      gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const onMouseLeaveArea = () => {
      gsap.to(cursor, { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: 'power2.inOut' });
    };

    // If cursor is fixed, listen on window. If cursor is child of area, listen on area.
    // Assuming cursor is fixed for broader applicability across the slider area.
    // area.addEventListener('mousemove', onMouseMove); // Use this if cursor is child of area
    window.addEventListener('mousemove', onMouseMove); // Use this if cursor is fixed
    area.addEventListener('mouseenter', onMouseEnterArea);
    area.addEventListener('mouseleave', onMouseLeaveArea);

    return () => {
      // window.removeEventListener('mousemove', onMouseMove); // If listening on window
      window.removeEventListener('mousemove', onMouseMove);
      area.removeEventListener('mouseenter', onMouseEnterArea);
      area.removeEventListener('mouseleave', onMouseLeaveArea);
      gsap.killTweensOf(cursor);
    };
  }, [cursorRef, activeAreaRef /*, text*/]);
};

export default usePortfolioCursor;
