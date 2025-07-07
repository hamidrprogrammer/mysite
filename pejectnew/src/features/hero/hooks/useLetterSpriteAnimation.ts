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

      // Initial state for sprites is opacity 0 (set by HeroSection.tsx or CSS)
      // and potentially a starting transform e.g. scale(1.3) as per original inline styles
      // We can set it here again to be sure, or rely on CSS.
      // For example, if styles.spriteContainer in CSS has opacity:0 and transform: scale(1.3)
      // gsap.set(spriteBox, { autoAlpha: 0, scale: 1.3, yPercent: 10 }); // Example initial state

      const tl = gsap.timeline({ paused: true });
      tl.to(spriteBox, {
        autoAlpha: 1,
        scale: 1, // Animate from 1.3 (CSS) to 1
        yPercent: 0, // Animate from 10 (example) to 0
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
