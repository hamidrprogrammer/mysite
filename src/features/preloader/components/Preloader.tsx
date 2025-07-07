import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/Preloader.module.css';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const haloMobileRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500);
      }
    });

    // Counter animation
    if (counterRef.current) {
      const digits = counterRef.current.querySelectorAll(`.${styles.counterPic}`);
      
      // Animate counter from 0 to 100
      tl.to(digits, {
        y: -142 * 9, // Move to show "9" (last digit)
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1
      });
    }

    // Mobile halo animation
    if (haloMobileRef.current) {
      tl.to(haloMobileRef.current, {
        filter: "drop-shadow(0 0 2em white)",
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      }, 0);
    }

    // Background animation
    if (backgroundRef.current) {
      tl.to(backgroundRef.current, {
        scaleX: 0,
        transformOrigin: "right",
        duration: 1,
        ease: "power2.inOut"
      }, "+=0.5");
    }

    // Fade out preloader
    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className={styles.preloaderWrapper}>
      <div ref={counterRef} className={styles.preloaderCounter}>
        <div className={styles.counterDigitContainer}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <img
              key={digit}
              src={`/pic/counter_${digit % 3 + 1}.svg`}
              alt={digit.toString()}
              className={styles.counterPic}
            />
          ))}
        </div>
        <div className={styles.counterDigitContainer}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <img
              key={digit}
              src={`/pic/counter_${digit % 3 + 1}.svg`}
              alt={digit.toString()}
              className={styles.counterPic}
            />
          ))}
        </div>
        <div className={styles.counterDigitContainer}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <img
              key={digit}
              src={`/pic/counter_${digit % 3 + 1}.svg`}
              alt={digit.toString()}
              className={styles.counterPic}
            />
          ))}
        </div>
      </div>

      <img
        ref={haloMobileRef}
        src="/halo.png"
        alt="Halo"
        className={styles.preloaderHaloMobile}
      />

      <div ref={backgroundRef} className={styles.preloaderBackground}></div>
    </div>
  );
};

export default Preloader;