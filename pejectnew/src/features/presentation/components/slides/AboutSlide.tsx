import React, { useRef } from 'react';
import styles from '../../styles/slides/AboutSlide.module.css';
import useInfiniteTextScroll from '../../hooks/useInfiniteTextScroll';

interface AboutSlideProps {
  isCurrentSlide: boolean; // To control animation play/pause
}

const infiniteTextItems = [
  "STARTUP", "CORPORATE", "EDTECH", "ENTERPRISE",
  "DIGITAL AGENCY", "RETAIL", "MEDIA STUDIO", "SAAS",
  "FINTECH", "FOODTECH", "CONSTRUCTION BUSINESS"
];

const partnerLogos = [
  { src: "/pic/logo01.webp", alt: "Partner Logo 1", width: "51.5" },
  { src: "/pic/logo02.webp", alt: "Partner Logo 2", width: "77.5" },
  { src: "/pic/logo03.webp", alt: "Partner Logo 3", width: "69.5" },
  { src: "/pic/logo04.webp", alt: "Partner Logo 4", width: "124.5" },
  { src: "/pic/logo05.webp", alt: "Partner Logo 5", width: "180.5" },
  { src: "/pic/logo06.webp", alt: "Partner Logo 6", width: "143" },
  { src: "/pic/logo07.webp", alt: "Partner Logo 7", width: "109.5" },
  { src: "/pic/logo08.webp", alt: "Partner Logo 8", width: "111" },
];

const AboutSlide: React.FC<AboutSlideProps> = ({ isCurrentSlide }) => {
  const topTextWrapperRef = useRef<HTMLDivElement>(null);
  const bottomTextWrapperRef = useRef<HTMLDivElement>(null);

  useInfiniteTextScroll({ wrapperRef: topTextWrapperRef, isSlideVisible: isCurrentSlide, direction: 'left', speed: 80 });
  useInfiniteTextScroll({ wrapperRef: bottomTextWrapperRef, isSlideVisible: isCurrentSlide, direction: 'right', speed: 80 });

  return (
    <div id="about-slide" className={`${styles.slide} ${styles.middleSlide} slide middle`}>
      <div className={styles.aboutLayout}>
        <div className={`${styles.infiniteText} ${styles.topInfiniteText}`}>
          <div ref={topTextWrapperRef} className={styles.infiniteTextWrapper}>
            {infiniteTextItems.map((item, index) => (
              <div key={`top-${index}`} className={styles.infiniteTextItem}>{item}</div>
            ))}
            {infiniteTextItems.map((item, index) => (
              <div key={`top-dup-${index}`} className={styles.infiniteTextItem} aria-hidden="true">{item}</div>
            ))}
          </div>
        </div>
        <div className={styles.aboutContent}>
          <h2 id="about-header">
            RADIANCE TEAM HAS BEEN IN THE GAME FOR 8 STRAIGHT YEARS
          </h2>
          <div className={styles.partnerBranding}>
            {partnerLogos.map((logo, index) => (
              <img key={index} src={logo.src} loading="lazy" alt={logo.alt} style={{width: logo.width + "px"}} />
            ))}
          </div>
        </div>
        <div className={`${styles.infiniteText} ${styles.bottomInfiniteText}`}>
          <div className={styles.infiniteTextWrapper}>
            {infiniteTextItems.map((item, index) => (
              <div key={`bottom-${index}`} className={styles.infiniteTextItem}>{item}</div>
            ))}
            {/* Duplicate for seamless loop */}
            {infiniteTextItems.map((item, index) => (
              <div key={`bottom-dup-${index}`} className={styles.infiniteTextItem} aria-hidden="true">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSlide;
