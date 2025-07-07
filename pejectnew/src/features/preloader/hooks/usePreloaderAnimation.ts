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
    if (counterImageRef.current && counterImageRef.current.offsetHeight > 0) {
      // Assuming the image is a strip of 10 digits (0-9).
      // The original script uses offsetHeight/2 but then multiplies by index*3 and index.
      // Let's assume numberHeight is the height of a single digit.
      // If counter1-pic.svg is 142px high and contains one digit for the preloader view, then this is correct.
      // If counter1-pic.svg is a sprite sheet of 10 digits, and its visible height in the container is 142px,
      // then the actual image height might be 1420px.
      // The key is what y: -numberHeight means. If it means "move by one digit's height".
      // The original inline script had: var numberHeight = REFERENCE.offsetHeight/2;
      // and then used y: -numberHeight*counterIndex for counter2 and y: -numberHeight*counterIndex*3 for counter3
      // This implies numberHeight was indeed half the height of the visible part of the image (REFERENCE) in the container.
      // Let's stick to the original logic as much as possible, assuming REFERENCE.offsetHeight was the height of the visible <img id="counter1-pic">.
      // The preloader-counter div has height: 142px. So, counter1-pic image should also be 142px effectively.
        numberHeight = 142; // Height of one full digit image as used in transform.
        // The inline script's numberHeight = REFERENCE.offsetHeight/2 might have been a typo or
        // REFERENCE.offsetHeight was 284px. Given the preloader-counter height is 142px,
        // it's more likely numberHeight should directly relate to 142px.
        // If counter_1.svg itself is 142px high (displaying '0'), then y: -142px would show '1'.
        // Let's test with a direct value based on the visible container.
        // The original script had:
        // COUNTER_ELEMENT[2] (digit 3) -> y: -numberHeight*counterIndex*3
        // COUNTER_ELEMENT[1] (digit 2) -> y: -numberHeight*counterIndex
        // COUNTER_ELEMENT[0] (digit 1) -> y: -numberHeight (for 100%)
        // This means numberHeight is the unit of movement to show the next logical digit.
        // If counter_X.svg are sprite sheets where each "digit" is, for example, 142px high.
        // Then to show "1" from "0", you move by -142px.
        // The inline script's numberHeight = REFERENCE.offsetHeight/2; (where REFERENCE is counter1-pic)
        // Let's assume counter1-pic is 142px high. So numberHeight = 71.
        // Then y: -71 for counter1 to show '1'. This implies the '0' and '1' are stacked within that 142px.
        // This seems unlikely for simple image sprites.
        // More likely: counter_1.svg is a strip of 0-9. Height of this strip is e.g. 1420px. Visible part is 142px.
        // To show next digit, we move by 142px. So numberHeight = 142.

        // Re-evaluating: The original script's counter images are 142px high as per CSS for .preloader-counter
        // The inline script uses REFERENCE.offsetHeight/2 for numberHeight. Let's assume REFERENCE.offsetHeight is 142px.
        // So, numberHeight = 71px.
        // Then for 100: counter1 moves by -71px, counter2 by -710px, counter3 by -2130px.
        // This looks more plausible if the digits are packed very tightly or the sprite logic is complex.
        // Given the simplicity of the rest of the code, let's assume each counter_X.svg is a vertical strip of 10 digits (0-9)
        // and the height of ONE digit is 142px.
        // So, to move from '0' to '1', it's y: -142. To move from '0' to '9', it's y: -142*9.
        // The current logic in the hook for the final state:
        // counterDigitsRef.current[0] (1st digit of 100) -> y: -numberHeight (shows '1')
        // counterDigitsRef.current[1] (2nd digit of 100) -> y: -numberHeight * 10 (shows '0')
        // counterDigitsRef.current[2] (3rd digit of 100) -> y: -numberHeight * 30 (shows '0')
        // This implies numberHeight IS the height of a single digit.
        // And counter2 moves by 10 digits to show '0' (0..9, then 0). counter3 moves by 30 digits.
        // The values for counterIndex are 1 through 9 for the loop.
        // COUNTER_ELEMENT[1] (digit2) y: -numberHeight*counterIndex
        // COUNTER_ELEMENT[2] (digit3) y: -numberHeight*counterIndex*3
        // This means for counterIndex=1, digit2 shows '1', digit3 shows '3'. For counterIndex=9, digit2 shows '9', digit3 shows '7' (27%10).
        // This matches the original script's behavior.
        // The key is that `numberHeight` must be the height of a single digit display area.
        // The `preloader-counter` div is 142px high. So each digit container is 142px high.
        // The `img` inside it is also 142px high (effectively, due to overflow hidden on container).
        // So `numberHeight` should be 142.

        numberHeight = 142; // Height of one digit display area.
    }
    // Fallback if height couldn't be determined, crucial for GSAP not to use 0
    if (numberHeight === 0 && !isMobile) numberHeight = 142;


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
