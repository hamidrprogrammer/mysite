import { useEffect } from 'react';
import gsap from 'gsap';

interface UseLetterSpriteAnimationProps {
  letterContainersRef: React.RefObject<(HTMLDivElement | null)[]>;
  spriteContainersRef: React.RefObject<(HTMLDivElement | null)[]>;
  isReady: boolean; // To ensure animations only run when hero section is ready / visible
}

const useLetterSpriteAnimation = ({
  letterContainersRef,
  spriteContainersRef,
  isReady,
}: UseLetterSpriteAnimationProps) => {
  useEffect(() => {
    if (!isReady) return;

    const letters = letterContainersRef.current?.filter((el): el is HTMLDivElement => el !== null) || [];
    const sprites = spriteContainersRef.current?.filter((el): el is HTMLDivElement => el !== null) || [];

    if (letters.length === 0 || sprites.length === 0 || letters.length !== sprites.length) {
      console.warn('Letter or sprite containers are not properly set up or mismatched.');
      return;
    }

    const eventListeners: Array<() => void> = [];

    letters.forEach((letterBox, index) => {
      const spriteBox = sprites[index];
      if (!spriteBox) return;

      // Set initial state for sprites based on original site's inline styles
      // (translateX is assumed to be handled by CSS layout for now)
      gsap.set(spriteBox, {
        autoAlpha: 0,
        scale: 1.3,
        yPercent: 5, // Slight upward movement on reveal, adjust as needed
        // visibility: 'hidden' // GSAP autoAlpha handles visibility
      });

      const tl = gsap.timeline({ paused: true });
      tl.to(spriteBox, {
        autoAlpha: 1,
        scale: 1,
        yPercent: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
      // Optional: animate letter itself
      // tl.to(letterBox.querySelector('svg'), { scale: 1.05, duration: 0.2, ease: 'power1.inOut' }, 0);


      const handleMouseEnter = () => {
        tl.play();
      };

      const handleMouseLeave = () => {
        tl.reverse();
      };

      letterBox.addEventListener('mouseenter', handleMouseEnter);
      letterBox.addEventListener('mouseleave', handleMouseLeave);

      eventListeners.push(() => {
        letterBox.removeEventListener('mouseenter', handleMouseEnter);
        letterBox.removeEventListener('mouseleave', handleMouseLeave);
        tl.kill();
      });
    });

    return () => {
      eventListeners.forEach(cleanup => cleanup());
    };
  }, [letterContainersRef, spriteContainersRef, isReady]);
};

export default useLetterSpriteAnimation;
