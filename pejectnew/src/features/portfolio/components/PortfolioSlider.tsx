import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/PortfolioSlider.module.css';
import TiltCard from './TiltCard';
import usePortfolioSliderAnimation from '../hooks/usePortfolioSliderAnimation';
import usePortfolioCursor from '../hooks/usePortfolioCursor';

interface PortfolioItemLink { // Renamed from PortfolioItem to avoid conflict if used elsewhere
  id: string;
  title: string;
  subTitle?: string;
  tags?: string[];
  imageUrl?: string;
  behanceUrl: string;
  year?: string;
}

interface PortfolioSliderProps {
  items: PortfolioItemLink[];
  isReady?: boolean;
}

const PortfolioSlider: React.FC<PortfolioSliderProps> = ({ items, isReady }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tagARef = useRef<HTMLHeadingElement>(null);
  const tagBRef = useRef<HTMLHeadingElement>(null);
  const projectNameARef = useRef<HTMLHeadingElement>(null);
  const projectNameBRef = useRef<HTMLHeadingElement>(null);
  const projectYearRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const individualCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    individualCardRefs.current = individualCardRefs.current.slice(0, items.length);
  }, [items.length]);

  usePortfolioSliderAnimation({
    items,
    activeIndex,
    setActiveIndex, // Pass setActiveIndex to the hook if it needs to control index (e.g., for drag)
    cardsContainerRef,
    cardRefs: individualCardRefs,
    tagARef, tagBRef, projectNameARef, projectNameBRef, projectYearRef,
    isReady
  });

  usePortfolioCursor({
    cursorRef,
    activeAreaRef: cardsContainerRef
  });

  const currentItem = items[activeIndex] || items[0];

  // Basic Next/Prev handlers for testing (can be removed if drag is implemented)
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Set initial text content (GSAP in hook will handle animations for changes)
  useEffect(() => {
    if (!currentItem) return;
    if (tagARef.current) tagARef.current.textContent = currentItem.tags?.[0] || '';
    if (tagBRef.current) tagBRef.current.textContent = currentItem.tags?.[1] || '';
    if (projectNameARef.current) projectNameARef.current.textContent = currentItem.title;
    if (projectNameBRef.current) projectNameBRef.current.textContent = currentItem.subTitle || '';
    if (projectYearRef.current) projectYearRef.current.textContent = currentItem.year || '';
  }, [currentItem]); // Only re-run if currentItem changes for initial set


  return (
    <div className={styles.portfolioSliderContainer}>
      <div className={`${styles.portfolioWorkTag} portfolio-work-tag`}>
        <div className={`${styles.projectTagHeading} project-tag-heading`}>
          <h1 ref={tagARef} className={`${styles.projectTagA} project-tag-a`}></h1>
        </div>
        <div className={`${styles.projectTagHeading} project-tag-heading`}>
          <h1 ref={tagBRef} className={`${styles.projectTagB} project-tag-b`}></h1>
        </div>
      </div>

      <div ref={cardsContainerRef} className={`${styles.portfolioSliderCenter} portfolio-slider-center`}>
        {items.map((item, index) => (
            <TiltCard
              // Assign ref to the DOM element for each TiltCard for GSAP manipulation
              // ref={el => individualCardRefs.current[index] = el}
              key={item.id}
              item={item}
              isActive={index === activeIndex}
              // zIndex will be controlled by GSAP in usePortfolioSliderAnimation
              zIndex={items.length - Math.abs(index - activeIndex)}
            />
          )
        )}
      </div>

      <div className={`${styles.portfolioProjectName} portfolio-project-name`}>
        <div className={`${styles.projectNameHeading} project-name-heading`}>
          <h1 ref={projectNameARef} className={`${styles.projectNameA} project-name-a`}></h1>
          <div ref={projectYearRef} className={`${styles.projectYear} project-year`}></div>
        </div>
        <div className={`${styles.projectNameHeading} project-name-heading`}>
          <h1 ref={projectNameBRef} className={`${styles.projectNameB} project-name-b`}></h1>
        </div>
      </div>

      <div className={`${styles.portfolioCounter} portfolio-counter`}>
        {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>

      <div ref={cursorRef} className={`${styles.portfolioCursor} portfolio-cursor`}>SHOW</div>

      {/* Dev navigation buttons - remove for production */}
      <div className={styles.devNav} style={{position: 'absolute', bottom: '5rem', zIndex: 100}}>
        <button onClick={handlePrev} style={{padding: '10px', margin: '5px'}}>Prev</button>
        <button onClick={handleNext} style={{padding: '10px', margin: '5px'}}>Next</button>
      </div>
    </div>
  );
};

export default PortfolioSlider;
