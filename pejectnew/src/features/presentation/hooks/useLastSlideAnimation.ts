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
    if (!backgroundRef.current || !slideRef.current || !isReady) {
      // Ensure refs are available and the section is ready (post-preloader)
      return;
    }

    const background = backgroundRef.current;
    const triggerElement = slideRef.current; // The slide itself will trigger the animation

    animationRef.current?.kill(); // Kill previous animation to avoid conflicts

    // Initial state from CSS: .ending-background { transform: translateY(60%); }
    // Original HTML final state: style="transform: translate3d(0px, 407.04px, 0px) scale(3.3944, 3.3944);"
    // We will animate from CSS state towards the HTML final state using ScrollTrigger.

    gsap.set(background, {
      yPercent: 60, // Start from CSS value (translateY(60%))
      scale: 1.5,   // A sensible starting scale, adjust if CSS has specific initial scale
      transformOrigin: 'center center',
    });

    animationRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top center+=20%", // Start when the top of the slide is a bit past the center
        end: "bottom top",    // End when the bottom of the slide leaves the top of the viewport
        scrub: 1.2,           // Smooth scrubbing
        // markers: true,     // For debugging ScrollTrigger
      },
    });

    // Animate towards the target state seen in the original HTML
    // The 407.04px needs to be relative or converted to yPercent if slide height varies.
    // Let's assume for now we want it to move less extremely than yPercent: 0 and scale up.
    animationRef.current.to(background, {
      // y: 407, // If using fixed pixel value, ensure parent height is consistent
      yPercent: 0,  // Example: move to be centered vertically or slightly up
      scale: 3.4,   // Target scale from original
      ease: 'none', // Scrub handles the easing based on scroll speed
    });

    // This effect should only run when isReady changes or refs change,
    // isSlideVisible is more for play/pause of non-ScrollTriggered animations.
    // If isSlideVisible is used, it might conflict with ScrollTrigger's control.
    // For now, assuming ScrollTrigger handles activation.

    return () => {
      animationRef.current?.kill();
      // Retrieve the specific ScrollTrigger instance and kill it if needed, though killing the timeline usually suffices.
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === triggerElement && st.animation === animationRef.current) {
          st.kill();
        }
      });
      gsap.set(background, { clearProps: "transform" }); // Reset properties on cleanup
    };
  }, [backgroundRef, slideRef, isReady]); // isSlideVisible removed as ScrollTrigger handles this.
};

export default useLastSlideAnimation;
