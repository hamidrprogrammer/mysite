import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../../styles/slides/EstimatesSlide.module.css';

const EstimatesSlide: React.FC = () => {
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsWrapperRef.current) {
      const cards = cardsWrapperRef.current.querySelectorAll(`.${styles.estimateCard}`);
      
      // Horizontal scroll animation
      gsap.to(cardsWrapperRef.current, {
        x: () => -(cardsWrapperRef.current!.scrollWidth - window.innerWidth),
        duration: 10,
        repeat: -1,
        ease: 'none'
      });
    }
  }, []);

  return (
    <div className={styles.slide}>
      <div className={styles.approachLayout}>
        <div className={styles.approachContent}>
          <h2>
            <span className={styles.longHeading}>Our Approach</span>
            <span className={styles.shortHeading}>Process</span>
          </h2>
        </div>

        <div className={styles.estimateCardsHolder}>
          <div ref={cardsWrapperRef} className={styles.estimateCardsWrapper}>
            <img src="/pic/estimate_card_01.svg" alt="Estimate 1" className={styles.estimateCard} />
            <img src="/pic/estimate_card_02.svg" alt="Estimate 2" className={styles.estimateCard} />
            <img src="/pic/estimate_card_03.svg" alt="Estimate 3" className={styles.estimateCard} />
            <img src="/pic/estimate_card_01.svg" alt="Estimate 4" className={styles.estimateCard} />
            <img src="/pic/estimate_card_02.svg" alt="Estimate 5" className={styles.estimateCard} />
            <img src="/pic/estimate_card_03.svg" alt="Estimate 6" className={styles.estimateCard} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatesSlide;