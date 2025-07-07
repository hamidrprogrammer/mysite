import React, { useRef } from 'react';
import styles from '../../styles/slides/PhysicsSlide.module.css';
import useMatterPhysics from '../../hooks/useMatterPhysics'; // Import the Matter.js hook
// import Lottie from 'lottie-react'; // For Lottie animation

interface PhysicsSlideProps {
  isCurrentSlide: boolean;
}

const PhysicsSlide: React.FC<PhysicsSlideProps> = ({ isCurrentSlide }) => {
  const matterContainerRef = useRef<HTMLDivElement>(null);

  useMatterPhysics({
    containerRef: matterContainerRef,
    isSlideVisible: isCurrentSlide
  });

  // Placeholder for Lottie animation data
  // const lottieAnimationData = null; // Replace with actual animation data import

  return (
    <div id="physics-slide" className={`${styles.slide} ${styles.middleSlide} slide middle`}>
      <div className={styles.worktypeLayout}>
        <h2 className={styles.longHeading}>
          OUR WORK NOT BOUNDED BY BEATIFUL WEBSITES, CREATIVE VISUALS AND MOTION DESIGN
        </h2>
        <h2 className={styles.shortHeading}>
          Our work is not limited to just one thing
        </h2>
      </div>
      {/* The matter-wrapper div itself will be the container for Matter.js canvas */}
      <div ref={matterContainerRef} className={`${styles.matterWrapper} matter-wrapper`}>
        {/* Matter.js canvas will be injected here by the hook directly into matterContainerRef */}
        {/* The original .matter-second-container might not be needed if the hook targets .matter-wrapper directly */}
      </div>
      <div className={`${styles.lottiePhysicsWrapper} lottie-physics-wrapper`}>
        {/* {lottieAnimationData && <Lottie animationData={lottieAnimationData} loop={true} />} */}
        <p style={{color: 'grey', fontSize: '0.8em'}}>[Lottie Physics Animation Placeholder]</p>
      </div>
    </div>
  );
};

export default PhysicsSlide;
