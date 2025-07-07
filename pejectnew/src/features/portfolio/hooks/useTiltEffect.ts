import { useEffect, RefObject } from 'react';
import gsap from 'gsap';

interface UseTiltEffectOptions {
  maxTilt?: number; // Max tilt in degrees
  perspective?: number; // CSS perspective value
  scale?: number; // Scale on hover
  speed?: number; // Speed of transition
  reset?: boolean; // Reset on mouse leave
}

const useTiltEffect = (
  elementRef: RefObject<HTMLElement>,
  isActive: boolean, // Only apply effect if the card is active/interactive
  options?: UseTiltEffectOptions
) => {
  const {
    maxTilt = 10, // Max 10 degrees tilt
    perspective = 1000, // Default perspective
    scale = 1.05, // Default scale on hover
    speed = 0.3, // Transition speed
    reset = true, // Reset on mouse leave
  } = options || {};

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isActive) {
      // If not active, ensure it's reset if it was tilted
      if (element) gsap.to(element, { rotationX: 0, rotationY: 0, scale: 1, duration: speed, ease: 'power1.out' });
      return;
    }

    // Apply perspective to the parent of the element for better 3D effect, if possible
    // Or apply directly to the element if it's self-contained
    // element.style.setProperty('transform-style', 'preserve-3d'); // Ensure this is set if not already
    // if (element.parentElement) {
    //   element.parentElement.style.setProperty('perspective', `${perspective}px`);
    // }


    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { left, top, width, height } = element.getBoundingClientRect();

      const x = clientX - left; // x position within the element.
      const y = clientY - top;  // y position within the element.

      const tiltX = ((y / height) * 2 - 1) * -maxTilt; // Invert Y for natural feel
      const tiltY = ((x / width) * 2 - 1) * maxTilt;

      gsap.to(element, {
        rotationX: tiltX,
        rotationY: tiltY,
        scale: scale,
        duration: speed,
        ease: 'power1.out',
        transformPerspective: perspective, // Apply perspective for 3D effect
      });
    };

    const handleMouseLeave = () => {
      if (reset) {
        gsap.to(element, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: speed * 1.5, // Slower reset
          ease: 'power1.out',
        });
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      // Reset style on unmount
      gsap.to(element, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.1 });
    };
  }, [elementRef, isActive, maxTilt, perspective, scale, speed, reset]);
};

export default useTiltEffect;
