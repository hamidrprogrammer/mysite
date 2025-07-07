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
  // activeAreaRef is now an array of card elements, or the main container if cards are not available
  const areaToWatch = activeAreaRef.current; // This should be the portfolioSliderCenter for general mouse tracking

  if (!cursor || !areaToWatch) return;

  gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 });
  cursor.textContent = "SHOW"; // Set text

  const onMouseMoveOverWindow = (e: MouseEvent) => {
    // Always update cursor position based on window mousemove for smoothness
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1, // Fast follow
      ease: 'power2.out',
    });
  };

  // This effect adds the global mouse listener for position
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMoveOverWindow);
    return () => {
      window.removeEventListener('mousemove', onMouseMoveOverWindow);
    };
  }, []); // Empty dependency array, so it runs once


  // This effect handles showing/hiding cursor based on hovering over the activeAreaRef (cards container)
  useEffect(() => {
    const area = activeAreaRef.current;
    if (!area || !cursor) return;

    const onMouseEnterArea = (e: MouseEvent) => {
        // Check if the event target is one of the cards or inside them
        const cardElements = Array.from(area.querySelectorAll(`.${styles.tiltCardContainer}`)); // Assuming TiltCard.module.css exports this class
                                                                                              // Or use a data-attribute selector
        const isOverCard = cardElements.some(card => card.contains(e.target as Node));

        if (isOverCard) {
            gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
        } else {
            gsap.to(cursor, { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: 'power2.inOut' });
        }
    };

    const onMouseLeaveArea = () => {
        gsap.to(cursor, { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: 'power2.inOut' });
    };

    // Listen on the container, but logic inside checks if it's over a card
    area.addEventListener('mouseover', onMouseEnterArea); // mouseover bubbles and can check target
    area.addEventListener('mouseleave', onMouseLeaveArea);

    return () => {
      area.removeEventListener('mouseover', onMouseEnterArea);
      area.removeEventListener('mouseleave', onMouseLeaveArea);
      gsap.killTweensOf(cursor);
    };
  }, [cursorRef, activeAreaRef, styles.tiltCardContainer]); // Ensure styles.tiltCardContainer is stable or from a const
};

export default usePortfolioCursor;
