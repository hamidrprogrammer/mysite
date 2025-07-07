import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../../styles/slides/LastSlide.module.css';

const ArrowDownloadIcon = () => (
  <svg className={styles.arrowSvg} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" className={styles.arrowSvgBackground} />
    <path d="M32 20v24m-8-8l8 8 8-8" className={styles.arrowSvgArrow} strokeWidth="2" fill="none" />
    <line x1="32" y1="20" x2="32" y2="44" className={styles.arrowSvgLine} strokeWidth="2" />
  </svg>
);

const LastSlide: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (backgroundRef.current) {
      gsap.to(backgroundRef.current, {
        y: '-40%',
        scale: 1.2,
        duration: 2,
        ease: 'power2.out',
        delay: 1
      });
    }
  }, []);

  return (
    <div className={styles.slide}>
      <div className={styles.endingLayout}>
        <h2>Thank You</h2>
        <div className={styles.downloadPresentation}>
          <h3>Download Presentation</h3>
          <a href="/presentation.pdf" download className={styles.downloadLink}>
            <ArrowDownloadIcon />
          </a>
        </div>
      </div>

      <div className={styles.endingContentVisual}>
        <div ref={backgroundRef} className={styles.endingBackground}></div>
      </div>
    </div>
  );
};

export default LastSlide;