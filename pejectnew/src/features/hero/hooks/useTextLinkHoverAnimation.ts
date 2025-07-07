import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const useTextLinkHoverAnimation = (elementsRef: React.RefObject<(HTMLElement | null)[]>) => {
  useEffect(() => {
    const elements = elementsRef.current?.filter((el): el is HTMLElement => el !== null) || [];

    elements.forEach(el => {
      // Set initial CSS variable states for the hover effect
      // These should match the variables used in radiance.css for .hero-heading .heading-link::after
      gsap.set(el, {
        '--animated-link-width': '0%', // Start with no width for the underline
        '--animated-link-opacity': 0     // Start with transparent underline
      });

      const timeline = gsap.timeline({ paused: true });
      timeline.to(el, {
        '--animated-link-width': '100%', // Animate to full width
        '--animated-link-opacity': 1,    // Animate to full opacity
        duration: 0.3, // Duration can be adjusted
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
