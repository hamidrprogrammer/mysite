import React, { useRef } from 'react';
import styles from '../../styles/slides/EstimatesSlide.module.css';
import useHorizontalCardScroll from '../../hooks/useHorizontalCardScroll';

interface EstimatesSlideProps {
  isCurrentSlide: boolean;
}

const estimateCards = [
  { src: "/pic/estimate_card_02.svg", alt: "Estimate Card 2" },
  { src: "/pic/estimate_card_01.svg", alt: "Estimate Card 1" },
  { src: "/pic/estimate_card_03.svg", alt: "Estimate Card 3" },
  // Duplicates for infinite scroll effect
  { src: "/pic/estimate_card_02.svg", alt: "Estimate Card 2 duplicate" },
  { src: "/pic/estimate_card_01.svg", alt: "Estimate Card 1 duplicate" },
  { src: "/pic/estimate_card_03.svg", alt: "Estimate Card 3 duplicate" },
];


const EstimatesSlide: React.FC<EstimatesSlideProps> = ({ isCurrentSlide }) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useHorizontalCardScroll({
    holderRef,
    wrapperRef,
    isSlideVisible: isCurrentSlide
  });

  return (
    <div id="estimates-slide" className={`${styles.slide} ${styles.middleSlide} slide middle`}>
      <div className={styles.approachLayout}>
        <div className={styles.approachContent}>
          <h2 className={styles.longHeading}>
            WE BREAK DOWN THE PROJECT INTO SPRINTS AND EFFICIENTLY ALLOCATE TEAM HOURS WITHIN THE BUDGET
          </h2>
          <h2 className={styles.shortHeading}>
            WE EFFICIENTLY ALLOCATE TEAM HOURS WITHIN THE BUDGET
          </h2>
        </div>
        <div ref={holderRef} className={styles.estimateCardsHolder}>
          <div ref={wrapperRef} className={styles.estimateCardsWrapper}>
            {estimateCards.map((card, index) => (
              <img
                key={index}
                src={card.src}
                loading="lazy"
                alt={card.alt}
                className={styles.estimateCard}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatesSlide;
