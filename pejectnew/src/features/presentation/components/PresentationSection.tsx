import React, { useRef, useEffect } from 'react';
import styles from '../styles/PresentationSection.module.css';

// Import slide components
import GreetingsSlide from './slides/GreetingsSlide';
import AboutSlide from './slides/AboutSlide';
import PhysicsSlide from './slides/PhysicsSlide';
import EstimatesSlide from './slides/EstimatesSlide';
import LastSlide from './slides/LastSlide';

import usePresentationScrollAnimation from '../hooks/usePresentationScrollAnimation';

interface PresentationSectionProps {
  isReady: boolean; // To sync with preloader
}

const PresentationSection: React.FC<PresentationSectionProps> = ({ isReady }) => {
  const presentationSectionRef = useRef<HTMLElement>(null);
  const presentationWrapperRef = useRef<HTMLDivElement>(null);

  // Refs for individual slides
  const greetingSlideRef = useRef<HTMLDivElement>(null);
  const aboutSlideRef = useRef<HTMLDivElement>(null);
  const physicsSlideRef = useRef<HTMLDivElement>(null);
  const estimatesSlideRef = useRef<HTMLDivElement>(null);
  const lastSlideRef = useRef<HTMLDivElement>(null);

  // Collecting slide refs into an array to pass to the hook
  const slidesRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    slidesRefs.current = [
      greetingSlideRef.current,
      aboutSlideRef.current,
      physicsSlideRef.current,
      estimatesSlideRef.current,
      lastSlideRef.current
    ];
  }, []); // This effect runs once to populate the array of refs

  const { currentSlideIndex } = usePresentationScrollAnimation({
  sectionRef: presentationSectionRef,
  wrapperRef: presentationWrapperRef,
  slidesRefs: slidesRefs,
  isReady,
});

  const slidesComponents = [
    <GreetingsSlide key="greetings" />,
    <AboutSlide key="about" isCurrentSlide={currentSlideIndex === 1} />,
    <PhysicsSlide key="physics" isCurrentSlide={currentSlideIndex === 2} />,
    <EstimatesSlide key="estimates" isCurrentSlide={currentSlideIndex === 3} />,
    <LastSlide key="last" isCurrentSlide={currentSlideIndex === 4} />,
  ];

  const slideRefsList = [greetingSlideRef, aboutSlideRef, physicsSlideRef, estimatesSlideRef, lastSlideRef];


  return (
    <section
      id="presentation-section"
      ref={presentationSectionRef}
      className={`${styles.presentationSection} presentation-section`}
    >
      <div ref={presentationWrapperRef} className={styles.presentationWrapper}>
        <div className={styles.slidesLayout}>
          {slidesComponents.map((Component, index) => (
            <div key={index} ref={slideRefsList[index]} className={styles.slideWrapper}>
              {React.cloneElement(Component, { isCurrentSlide: currentSlideIndex === index })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;
