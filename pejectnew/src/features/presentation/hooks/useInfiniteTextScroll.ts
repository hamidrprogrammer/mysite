import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface UseInfiniteTextScrollProps {
  wrapperRef: React.RefObject<HTMLDivElement>;
  isSlideVisible: boolean; // To start/stop animation based on slide visibility
  direction?: 'left' | 'right'; // Direction of scroll
  speed?: number; // Duration of one full scroll cycle in seconds
}

const useInfiniteTextScroll = ({
  wrapperRef,
  isSlideVisible,
  direction = 'left',
  speed = 60, // Default speed: e.g., 60 seconds for one full scroll of its content width
}: UseInfiniteTextScrollProps) => {
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !isSlideVisible) {
      animationRef.current?.pause(); // Pause if not visible or no ref
      return;
    }

    const wrapper = wrapperRef.current;
    // Calculate the width of a single set of items (assuming content is duplicated for seamless loop)
    // This assumes the direct children are the items and there are no other elements affecting width.
    const items = wrapper.children;
    if (items.length === 0) return;

    let contentWidth = 0;
    for (let i = 0; i < items.length / 2; i++) { // Iterate over one set of items
        contentWidth += (items[i] as HTMLElement).offsetWidth;
        // Consider gap/margin if any is applied directly on items from CSS
        if (i < items.length / 2 -1 ) {
            const currentStyle = window.getComputedStyle(items[i] as HTMLElement);
            contentWidth += parseFloat(currentStyle.marginRight) || 0;
            // Or use gap from parent if it's a flex/grid container
        }
    }

    if (contentWidth === 0) return; // Avoid division by zero if width cannot be determined

    // Kill previous animation if it exists
    animationRef.current?.kill();

    // Set initial position
    gsap.set(wrapper, { x: 0 });

    animationRef.current = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });

    if (direction === 'left') {
      animationRef.current.to(wrapper, {
        x: -contentWidth,
        duration: speed * (contentWidth / wrapper.offsetWidth) // Adjust speed based on actual content vs visible width
      });
    } else { // direction === 'right'
      // For rightward scroll, start from a negative offset
      gsap.set(wrapper, { x: -contentWidth });
      animationRef.current.to(wrapper, {
        x: 0,
        duration: speed * (contentWidth / wrapper.offsetWidth)
      });
    }

    if(isSlideVisible) {
        animationRef.current.play();
    } else {
        animationRef.current.pause();
    }

    return () => {
      animationRef.current?.kill();
    };
  }, [wrapperRef, isSlideVisible, direction, speed]);
};

export default useInfiniteTextScroll;
