import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
// ScrollTrigger might not be needed if animation is based on isCurrentSlide and internal progress
// but can be useful if tied to the scroll progress *within* the last slide's pinned duration.

interface UseLastSlideAnimationProps {
  backgroundRef: React.RefObject<HTMLDivElement>;
  slideRef: React.RefObject<HTMLDivElement>; // Ref to the slide itself to trigger animation
  isSlideVisible: boolean; // To start/stop animation based on slide visibility
}

const useLastSlideAnimation = ({
  backgroundRef,
  slideRef,
  isSlideVisible,
}: UseLastSlideAnimationProps) => {
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!backgroundRef.current || !slideRef.current ) { // Removed !isSlideVisible from here to allow reset
      animationRef.current?.pause();
      // Potentially reset styles if slide becomes not visible and animation was part-way
      if(backgroundRef.current && !isSlideVisible){
        gsap.set(backgroundRef.current, { clearProps: "transform" }); // Reset if not visible
      }
      return;
    }

    if (!isSlideVisible) { // If slide is not visible but refs are present, pause and return
        animationRef.current?.pause();
        return;
    }


    const background = backgroundRef.current;
    // const slide = slideRef.current; // Needed if using ScrollTrigger with slide as trigger

    animationRef.current?.kill(); // Kill previous animation

    // Initial state is set by CSS (translateY(60%) scale(1.5))
    // We want to animate it to a final state, e.g., translateY(0) scale(1) or similar

    // This animation will play once when the slide becomes visible.
    // For a scroll-linked animation within the slide's pinned duration,
    // ScrollTrigger would be configured here with 'slide' as the trigger.
    animationRef.current = gsap.timeline();

    animationRef.current.fromTo(
      background,
      {
        yPercent: 60, // Matches initial CSS transform if possible, or set via GSAP
        scale: 1.5    // Matches initial CSS transform
      },
      {
        yPercent: 0,
        scale: 2.5, // Example: make it larger as it comes up
        duration: 1.2, // Duration of the background animation
        ease: 'power2.inOut',
        // ScrollTrigger example (if tied to scroll within this slide's view time):
        // scrollTrigger: {
        //   trigger: slide,
        //   start: "top bottom", // When top of slide hits bottom of viewport
        //   end: "bottom top", // When bottom of slide leaves top of viewport
        //   scrub: 1,
        // }
      }
    );

    if (isSlideVisible) {
        animationRef.current.play();
    } else {
        // This case is handled by the early return, but good for clarity
        animationRef.current.pause();
    }


    return () => {
      animationRef.current?.kill();
      // No need to gsap.set to clear props if it's handled by initial state or GSAP's overwrite
    };
  }, [backgroundRef, slideRef, isSlideVisible]);
};

export default useLastSlideAnimation;
