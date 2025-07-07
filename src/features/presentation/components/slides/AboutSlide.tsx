import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../../styles/slides/AboutSlide.module.css';

const AboutSlide: React.FC = () => {
  const topTextRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Infinite text scroll animation
    if (topTextRef.current) {
      gsap.to(topTextRef.current, {
        x: '-50%',
        duration: 20,
        repeat: -1,
        ease: 'none'
      });
    }

    if (bottomTextRef.current) {
      gsap.to(bottomTextRef.current, {
        x: '50%',
        duration: 25,
        repeat: -1,
        ease: 'none'
      });
    }
  }, []);

  return (
    <div className={styles.slide}>
      <div className={styles.aboutLayout}>
        {/* Top Infinite Text */}
        <div className={styles.infiniteText}>
          <div ref={topTextRef} className={`${styles.infiniteTextWrapper} ${styles.topInfiniteText}`}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={styles.infiniteTextItem}>
                Creative Studio • Design Agency • Brand Identity • 
              </span>
            ))}
          </div>
        </div>

        {/* About Content */}
        <div className={styles.aboutContent}>
          <h2>About Us</h2>
          <div className={styles.partnerBranding}>
            <img src="/pic/logo01.webp" alt="Partner 1" />
            <img src="/pic/logo02.webp" alt="Partner 2" />
            <img src="/pic/logo03.webp" alt="Partner 3" />
            <img src="/pic/logo04.webp" alt="Partner 4" />
            <img src="/pic/logo05.webp" alt="Partner 5" />
            <img src="/pic/logo06.webp" alt="Partner 6" />
          </div>
        </div>

        {/* Bottom Infinite Text */}
        <div className={styles.infiniteText}>
          <div ref={bottomTextRef} className={`${styles.infiniteTextWrapper} ${styles.bottomInfiniteText}`}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={styles.infiniteTextItem}>
                Web Development • UI/UX Design • Digital Solutions • 
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSlide;