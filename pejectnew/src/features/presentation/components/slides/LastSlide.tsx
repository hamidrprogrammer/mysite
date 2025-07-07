import React, { useRef } from 'react';
import styles from '../../styles/slides/LastSlide.module.css';
import useLastSlideAnimation from '../../hooks/useLastSlideAnimation';

interface LastSlideProps {
  isCurrentSlide: boolean;
}

// SVG Arrow for download button (can be a shared component)
const DownloadArrowIcon = () => (
    <svg className={styles.arrowSvg} width="64px" height="64px" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className={styles.arrowSvgBackground} cx="32.4724" cy="32.7634" r="31.9451" fill="#191919" />
        <path className={styles.arrowSvgArrow} d="M32.472 18.7402V38.9981M32.472 38.9981L41.0426 30.4275M32.472 38.9981L23.9014 30.4275" stroke="#F5F2EE" strokeWidth="1.5583" />
        <path className={styles.arrowSvgLine} d="M20.7852 46.7871H44.9387" stroke="#F5F2EE" strokeWidth="1.5583" />
    </svg>
);

const LastSlide: React.FC<LastSlideProps> = ({ isCurrentSlide }) => {
  const slideRef = useRef<HTMLDivElement>(null); // Ref for the main slide container
  const backgroundRef = useRef<HTMLDivElement>(null); // Ref for the .endingBackground div

  useLastSlideAnimation({
    backgroundRef,
    slideRef,
    isSlideVisible: isCurrentSlide,
  });

  return (
    <div ref={slideRef} id="last-slide" className={`${styles.slide} ${styles.middleSlide} ${styles.lastSlideContent} slide middle`}>
      <div className={styles.endingLayout}>
        <h2>AND THIS IS JUST ONLY SMALL <br /> PART OF OUR PRESENTATION</h2>
        <div className={styles.downloadPresentation}>
          <h3>OPEN FULL PDF VERSION</h3>
          <a className={styles.downloadLink} href="/radiance-preview.pdf" target="_blank" rel="noopener noreferrer">
            <DownloadArrowIcon />
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
