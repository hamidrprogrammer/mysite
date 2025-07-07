import React, { useRef, useEffect } from 'react';
import styles from '../styles/PortfolioWelcome.module.css'; // To be created
import gsap from 'gsap';

interface PortfolioWelcomeProps {
  isReady?: boolean; // To trigger animation when section is ready
}

const PortfolioWelcome: React.FC<PortfolioWelcomeProps> = ({ isReady }) => {
  const welcomeRef = useRef<HTMLDivElement>(null);
  const headingLabelRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady && welcomeRef.current && wallRef.current && headingLabelRef.current && h1Ref.current) {
      // Initial animation for the welcome screen
      // This is a simplified version, actual animation will be in the logic step
      gsap.set(headingLabelRef.current, { yPercent: 100, autoAlpha:0 });
      gsap.set(h1Ref.current, { yPercent: 100, autoAlpha:0 });
      gsap.set(wallRef.current, { yPercent: 0 }); // Wall initially covers

      const tl = gsap.timeline({ delay: 0.5 }); // Delay slightly after section becomes "ready"
      tl
        .to(wallRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power2.inOut'
        })
        .to([headingLabelRef.current, h1Ref.current], {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power1.out'
        }, "-=0.6")
        // After text reveal, fade out the entire welcome screen
        .to(welcomeRef.current, {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power1.inOut',
          delay: 1, // Delay before fading out the welcome screen
          onComplete: () => {
            if (welcomeRef.current) {
              // Optional: set display to none after fade out to prevent interference
              // welcomeRef.current.style.display = 'none';
            }
          }
        });
    }
  }, [isReady]);

  return (
    <div ref={welcomeRef} className={`${styles.portfolioWelcome} portfolio-welcome`}>
      <div className={styles.portfolioWelcomeContent}>
        <div ref={headingLabelRef} className={`${styles.headingLabel} heading-label`}>BEST OF</div>
        <h1 ref={h1Ref}>OUR WORKS</h1>
        <div ref={wallRef} className={`${styles.welcomeWall} welcome-wall`}></div>
      </div>
    </div>
  );
};

export default PortfolioWelcome;
