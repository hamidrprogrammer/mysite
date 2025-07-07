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

    // Calculate the width of a single set of items (assuming content is duplicated for seamless loop)
    const singleSetWidth = wrapper.scrollWidth / 2;

    if (singleSetWidth <= holderWidth && scrollWidth > holderWidth) {
        // Content is wider than holder, but not enough for a full seamless loop with duplication.
        // Simple back and forth or no scroll might be better.
        // For now, let's allow the existing logic to try, or just disable if not wide enough for one set.
        // This case should ideally not happen if duplication is correct and content is rich.
        console.warn("Content might not be wide enough for seamless duplicated scroll anmimation.");
    }

    if (scrollWidth <= holderWidth) { // No need to scroll if content fits
        gsap.set(wrapper, { x: 0 });
        animationRef.current?.kill(); // Ensure no previous animation runs
        return;
    }

    animationRef.current?.kill(); // Kill previous animation

    gsap.set(wrapper, { x: 0 }); // Ensure starting position

    // Create a seamless loop
    animationRef.current = gsap.to(wrapper, {
      x: `-=${singleSetWidth}`, // Move left by the width of one set of items
      duration: singleSetWidth / 80, // Adjust speed: 80 pixels per second
      ease: 'none',
      repeat: -1,
      modifiers: { // GSAP 3 feature
        x: gsap.utils.unitize(gsap.utils.wrap(0, -singleSetWidth)) // Wrap the x value
      }
    });

    // Alternative timeline approach for older GSAP or more control:
    // animationRef.current = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
    // animationRef.current
    //   .to(wrapper, {
    //     x: `-=${singleSetWidth}`,
    //     duration: singleSetWidth / 80, // Adjust speed (e.g., 80px/sec)
    //   })
    //   .set(wrapper, { x: 0 }); // Immediately reset to start for the next loop iteration

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
