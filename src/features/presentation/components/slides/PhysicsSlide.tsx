import React from 'react';
import styles from '../../styles/slides/PhysicsSlide.module.css';

const PhysicsSlide: React.FC = () => {
  return (
    <div className={styles.slide}>
      <div className={styles.worktypeLayout}>
        <h2>
          <span className={styles.longHeading}>What We Do</span>
          <span className={styles.shortHeading}>Services</span>
        </h2>
      </div>
      
      {/* Matter.js physics will be added here */}
      <div className={styles.matterWrapper}>
        <div className={styles.matterSecondContainer}>
          {/* Physics canvas will be injected here */}
        </div>
      </div>

      {/* Lottie animation wrapper */}
      <div className={styles.lottiePhysicsWrapper}>
        {/* Lottie animation will be added here */}
      </div>
    </div>
  );
};

export default PhysicsSlide;