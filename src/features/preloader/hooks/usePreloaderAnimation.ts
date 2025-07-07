import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface UsePreloaderAnimationProps {
  onAnimationComplete: () => void;
  pageIsReady: boolean;
}

const usePreloaderAnimation = ({ onAnimationComplete, pageIsReady }: UsePreloaderAnimationProps) => {
  const preloaderWrapperRef = useRef<HTMLDivElement>(null);
  const preloaderBackgroundRef = useRef<HTMLDivElement>(null);
  const preloaderCounterRef = useRef<HTMLDivElement>(null);
  const counterDigitsRef = useRef<Array<HTMLDivElement | null>>([]);
  const counterImageRef = useRef<HTMLImageElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    if (!preloaderWrapperRef.current) return;

    let numberHeight = 0;
    if (counterImageRef.current) {
        numberHeight = counterImageRef.current.offsetHeight / 2;
    }
    if (numberHeight === 0 && !isMobile) numberHeight = 142 / 2;

    let counterIndex = 1;
    let preloaderAnimationTimeline: gsap.core.Timeline | null = null;

    if (!isMobile) {
      if (!preloaderBackgroundRef.current || !preloaderCounterRef.current || counterDigitsRef.current.some(el => !el)) {
        console.warn('Preloader elements missing for desktop animation.');
        onAnimationComplete();
        return;
      }

      preloaderAnimationTimeline = gsap.timeline({
        paused: true,
        onComplete: () => {
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
              onAnimationComplete();
            }
          }
        }, 600);
      };

      if (numberHeight > 0) {
        preloaderLoop();
      } else {
        console.warn("Could not determine preloader number height. Skipping count animation.");
        if (preloaderAnimationTimeline) {
            preloaderAnimationTimeline.play(0.1);
        } else {
            onAnimationComplete();
        }
      }

    } else { // Mobile animation
      const preloaderHaloMobile = document.querySelector(".preloader-halo-mobile") as HTMLElement | null;
      if (preloaderHaloMobile) {
        gsap.to(preloaderHaloMobile, {
            css: {"--shadowPreloader": "3em"},
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

  }, [isMobile, pageIsReady, onAnimationComplete]);

  return { preloaderWrapperRef, preloaderBackgroundRef, preloaderCounterRef, counterDigitsRef, counterImageRef };
};

export default usePreloaderAnimation;