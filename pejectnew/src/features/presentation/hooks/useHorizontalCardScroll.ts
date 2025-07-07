import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger'; // ScrollTrigger might be used if the scroll is tied to main page scroll

// If not using main page ScrollTrigger, we might need Draggable for a self-contained scroll
// import Draggable from 'gsap/Draggable';
// gsap.registerPlugin(Draggable);

interface UseHorizontalCardScrollProps {
  holderRef: React.RefObject<HTMLDivElement>; // The viewport for the cards
  wrapperRef: React.RefObject<HTMLDivElement>; // The direct container of all cards that moves
  isSlideVisible: boolean;
  // numCards: number; // If needed for calculations, but can be derived
  // cardWidth?: number; // If fixed, otherwise calculate
}

const useHorizontalCardScroll = ({
  holderRef,
  wrapperRef,
  isSlideVisible,
}: UseHorizontalCardScrollProps) => {
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!holderRef.current || !wrapperRef.current || !isSlideVisible) {
      animationRef.current?.pause();
      return;
    }

    const holder = holderRef.current;
    const wrapper = wrapperRef.current;

    // Calculate the total width of the scrollable content (all cards + gaps)
    // This assumes all cards are of similar width or we calculate sum of all widths
    const scrollWidth = wrapper.scrollWidth; // Total width of the content including overflow
    const holderWidth = holder.offsetWidth; // Visible width

    if (scrollWidth <= holderWidth) { // No need to scroll if content fits
        gsap.set(wrapper, { x: 0 }); // Ensure it's at the start
        return;
    }

    const scrollDistance = scrollWidth - holderWidth;

    animationRef.current?.kill(); // Kill previous animation

    // Simple repeating animation for now.
    // For a ScrollTrigger-based animation tied to page scroll, the setup would be different,
    // involving pinning the slide and scrubbing the 'x' property of the wrapper.
    // This example creates a continuous loop.

    gsap.set(wrapper, { x: 0 }); // Start at the beginning

    animationRef.current = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'none' }
    });

    // Animate to the end, then jump back to start.
    // The duration should be proportional to the scrollDistance to maintain consistent speed.
    // Example: 20 pixels per second speed.
    const speed = 100; // pixels per second
    const duration = scrollDistance / speed;

    animationRef.current
      .to(wrapper, { x: -scrollDistance, duration: duration })
      // Add a brief pause at the end before looping (optional)
      // .to(wrapper, {duration: 1}) // pause for 1s
      // To make it truly seamless with duplicated content, you'd animate x to -scrollWidth/2
      // and then on repeat, jump x back by scrollWidth/2.
      // This requires the content in wrapperRef to be duplicated.
      // The current JSX for EstimatesSlide already duplicates cards.
      // So, we animate to the end of the first set of cards.
      .to(wrapper, { x: -(scrollWidth / 2), duration: (scrollWidth / 2) / speed })
      .set(wrapper, { x: 0 }) // Jump back to start for the loop

    if (isSlideVisible) {
      animationRef.current.play();
    } else {
      animationRef.current.pause();
    }

    return () => {
      animationRef.current?.kill();
      gsap.set(wrapper, {clearProps: "x"}); // Clear transform
    };
  }, [holderRef, wrapperRef, isSlideVisible]);
};

export default useHorizontalCardScroll;
