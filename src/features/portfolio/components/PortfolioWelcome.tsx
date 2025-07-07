import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/PortfolioWelcome.module.css';

gsap.registerPlugin(ScrollTrigger);

const PortfolioWelcome: React.FC = () => {
  const welcomeRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!welcomeRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: welcomeRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      }
    });

    // Animate wall up
    if (wallRef.current) {
      tl.to(wallRef.current, {
        yPercent: -100,
        duration: 1,
        ease: 'power2.inOut'
      });
    }

    // Animate text
    if (labelRef.current && headingRef.current) {
      tl.fromTo([labelRef.current, headingRef.current], {
        yPercent: 100,
        autoAlpha: 0
      }, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.1
      }, 0.2);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={welcomeRef} className={styles.portfolioWelcome}>
      <div className={styles.portfolioWelcomeContent}>
        <span ref={labelRef} className={styles.headingLabel}>Portfolio</span>
        <h1 ref={headingRef}>Our Works</h1>
      </div>
      <div ref={wallRef} className={styles.welcomeWall}></div>
    </div>
  );
};

export default PortfolioWelcome;