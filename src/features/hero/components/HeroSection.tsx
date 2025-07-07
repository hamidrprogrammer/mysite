import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import styles from '../styles/HeroSection.module.css';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize text splitting
    if (headingRef.current) {
      const split = new SplitType(headingRef.current, {
        types: 'lines',
        lineClass: styles.splitLine
      });

      // Animate text reveal
      gsap.fromTo(split.lines, {
        y: '100%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.5
      });
    }

    // Mask animation
    if (maskRef.current) {
      const maskParts = maskRef.current.querySelectorAll(`.${styles.heroMaskPart}`);
      
      gsap.to(maskParts, {
        scaleY: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power2.inOut',
        delay: 1.5
      });
    }

    // Video fade in
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        opacity: 1,
        duration: 1,
        delay: 2
      });
    }

    // Bottom content animation
    const bottomElements = heroRef.current?.querySelectorAll(`.${styles.bottomWrapper} > *`);
    if (bottomElements) {
      gsap.fromTo(bottomElements, {
        y: 50,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        delay: 2.5
      });
    }

  }, []);

  return (
    <section ref={heroRef} className={styles.heroSection}>
      {/* Background Video */}
      <div className={styles.backgroundVideoWrapper}>
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Hero Mask */}
      <div ref={maskRef} className={styles.heroMask}>
        <div className={styles.heroMaskPart}></div>
        <div className={styles.heroMaskPart}></div>
      </div>

      {/* Heading */}
      <div className={styles.headingWrapper}>
        <h1 ref={headingRef} className={styles.heroHeading}>
          <span className={styles.notHoverable}>We are </span>
          <a href="#" className={styles.headingLink}>Radiance</a>
          <span className={styles.notHoverable}>, a creative studio</span>
        </h1>
        <h1 className={styles.heroHeadingMobile}>
          We are Radiance, a creative studio
        </h1>
      </div>

      {/* Bottom Content */}
      <div className={styles.bottomWrapper}>
        <div className={styles.bottomLinksWrapper}>
          <div>
            <span className={styles.welcome} id="local-time">12:34 PM</span>
            <span className={styles.welcome}>Tehran</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.descriptor}>
            <span>Design Crew</span>
          </div>
          <div className={styles.divider}></div>
          <div>
            <a href="#" className={styles.animatedLinkFooter}>
              <span>Behance</span>
            </a>
            <a href="#" className={styles.animatedLinkFooter}>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Letters */}
        <div className={styles.lettersWrapper}>
          <div className={styles.letterContainer}>
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 80V20h15c8 0 15 7 15 15s-7 15-15 15H20v30z"/>
            </svg>
          </div>
          <div className={styles.letterContainer}>
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 80V20h40v10H30v15h25v10H30v15h30v10H20z"/>
            </svg>
          </div>
          <div className={styles.letterContainer}>
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 80V20h15c8 0 15 7 15 15s-7 15-15 15H20v30z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile Lottie Container */}
      <div className={styles.mobileLettersLottieContainer}>
        {/* Lottie animation will be added here */}
      </div>
    </section>
  );
};

export default HeroSection;