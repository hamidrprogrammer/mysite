import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const useTextLinkHoverAnimation = (elementsRef: React.RefObject<(HTMLElement | null)[]>) => {
  useEffect(() => {
    const elements = elementsRef.current?.filter((el): el is HTMLElement => el !== null) || [];

    elements.forEach(el => {
      // Set initial CSS variable states
      gsap.set(el, {
        '--underline-width': 0,
        '--underline-opacity': 0
      });

      const timeline = gsap.timeline({ paused: true });
      timeline.to(el, {
        '--underline-width': 1,
        '--underline-opacity': 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      const handleMouseEnter = () => timeline.play();
      const handleMouseLeave = () => timeline.reverse();

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup function
      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        timeline.kill(); // Kill the timeline to prevent memory leaks
      };
    });
  }, [elementsRef]); // Rerun if the refs array itself changes (though individual elements changing won't trigger this)
};

export default useTextLinkHoverAnimation;
