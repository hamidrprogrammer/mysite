import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface UsePreloaderAnimationProps {
  onAnimationComplete: () => void;
  pageIsReady: boolean; // To signal when the main page content is ready (e.g., DOMContentLoaded)
}

const usePreloaderAnimation = ({ onAnimationComplete, pageIsReady }: UsePreloaderAnimationProps) => {
  const preloaderWrapperRef = useRef<HTMLDivElement>(null);
  const preloaderBackgroundRef = useRef<HTMLDivElement>(null);
  const preloaderCounterRef = useRef<HTMLDivElement>(null);
  const counterDigitsRef = useRef<Array<HTMLDivElement | null>>([]);
  const counterImageRef = useRef<HTMLImageElement>(null); // Ref for one of the counter images to get height

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);

    // Assign refs to DOM elements if not already done by React directly
    if (preloaderWrapperRef.current === null) {
      preloaderWrapperRef.current = document.getElementById('preloader-wrapper') as HTMLDivElement | null;
    }
    if (preloaderBackgroundRef.current === null) {
      preloaderBackgroundRef.current = document.getElementById('preloader-background') as HTMLDivElement | null;
    }
    if (preloaderCounterRef.current === null) {
      preloaderCounterRef.current = document.getElementById('preloader-counter') as HTMLDivElement | null;
    }
    if(counterDigitsRef.current.length === 0) {
        counterDigitsRef.current = [
            document.getElementById('counter1') as HTMLDivElement | null,
            document.getElementById('counter2') as HTMLDivElement | null,
            document.getElementById('counter3') as HTMLDivElement | null,
        ];
    }
    if(counterImageRef.current === null) {
        counterImageRef.current = document.getElementById('counter1-pic') as HTMLImageElement | null;
    }

  }, []);


  useEffect(() => {
    if (!preloaderWrapperRef.current) return;

    let numberHeight = 0;
    if (counterImageRef.current) {
        numberHeight = counterImageRef.current.offsetHeight / 2;
    }
    if (numberHeight === 0 && !isMobile) numberHeight = 142 / 2; // Fallback, original was 284/2 for the whole image, so 142 for half (one digit)

    let counterIndex = 1;
    let preloaderAnimationTimeline: gsap.core.Timeline | null = null;

    if (!isMobile) {
      if (!preloaderBackgroundRef.current || !preloaderCounterRef.current || counterDigitsRef.current.some(el => !el)) {
        console.warn('Preloader elements missing for desktop animation.');
        onAnimationComplete(); // Skip animation if elements are missing
        return;
      }

      preloaderAnimationTimeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (preloaderWrapperRef.current) {
            // gsap.set(preloaderWrapperRef.current, { yPercent: -100, autoAlpha: 0 });
          }
          onAnimationComplete();
        }
      });

      preloaderAnimationTimeline
        .to(preloaderBackgroundRef.current, { yPercent: -100, duration: 1.4, ease: "power3.inOut" })
        .to(preloaderCounterRef.current, { yPercent: 150, duration: 1.2, ease: "power1.inOut" }, "<0.1")
        .to(preloaderWrapperRef.current, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut"}, "-=0.5");


      const preloaderLoop = () => {
        setTimeout(() => {
          if (!pageIsReady && counterIndex < 10) {
             if (counterDigitsRef.current[2] && numberHeight > 0) {
                gsap.to(counterDigitsRef.current[2], { y: -numberHeight * counterIndex * 3, duration: 0.2, ease: "power4.inOut" });
            }
            if (counterDigitsRef.current[1] && numberHeight > 0) {
                gsap.to(counterDigitsRef.current[1], { y: -numberHeight * counterIndex, duration: 0.3, ease: "power3.inOut" });
            }
            counterIndex++;
            preloaderLoop();
          } else {
            // Final animation to "100"
            if (counterDigitsRef.current[0] && numberHeight > 0) {
                gsap.to(counterDigitsRef.current[0], { y: -numberHeight, duration: 0.3, ease: "power2.inOut" });
            }
             if (counterDigitsRef.current[1] && numberHeight > 0) {
                gsap.to(counterDigitsRef.current[1], { y: -numberHeight * 10, duration: 0.5, ease: "power3.inOut" });
            }
            if (counterDigitsRef.current[2] && numberHeight > 0) {
                gsap.to(counterDigitsRef.current[2], { y: -numberHeight * 30, duration: 0.3, ease: "power4.inOut" });
            }
            if (preloaderAnimationTimeline) {
              preloaderAnimationTimeline.play();
            } else {
              onAnimationComplete(); // Failsafe
            }
          }
        }, 600);
      };

      if (numberHeight > 0) {
        preloaderLoop();
      } else {
         // Fallback if numberHeight couldn't be determined
        console.warn("Could not determine preloader number height. Skipping count animation.");
        if (preloaderAnimationTimeline) {
            preloaderAnimationTimeline.play(0.1); // Play a bit of the exit animation
        } else {
            onAnimationComplete();
        }
      }

    } else { // Mobile animation
      const preloaderHaloMobile = document.querySelector(".preloader-halo-mobile") as HTMLElement | null; // Using querySelector as it might not be in preloaderWrapperRef directly
      if (preloaderHaloMobile) {
        gsap.to(preloaderHaloMobile, {
            css: {"--shadowPreloader": "3em"}, // Assuming --shadowPreloader is defined
            yoyo: true,
            repeat: -1,
            duration: 1
        });
      }

      if (pageIsReady) {
        if (preloaderWrapperRef.current) {
          gsap.to(preloaderWrapperRef.current, {
            xPercent: -100,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                if (preloaderWrapperRef.current) preloaderWrapperRef.current.style.display = 'none';
                onAnimationComplete();
            }
          });
        } else {
          onAnimationComplete();
        }
      }
    }

    return () => {
        gsap.killTweensOf(preloaderWrapperRef.current);
        gsap.killTweensOf(preloaderBackgroundRef.current);
        gsap.killTweensOf(preloaderCounterRef.current);
        counterDigitsRef.current.forEach(el => { if(el) gsap.killTweensOf(el); });
        if (preloaderAnimationTimeline) {
            preloaderAnimationTimeline.kill();
        }
    };

  }, [isMobile, pageIsReady, onAnimationComplete]); // Rerun if isMobile or pageIsReady changes

  return { preloaderWrapperRef, preloaderBackgroundRef, preloaderCounterRef, counterDigitsRef, counterImageRef };
};

export default usePreloaderAnimation;
