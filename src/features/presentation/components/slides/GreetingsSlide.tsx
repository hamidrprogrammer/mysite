import React from 'react';
import styles from '../../styles/slides/GreetingsSlide.module.css';

const GreetingsSlide: React.FC = () => {
  return (
    <div className={`${styles.slide} ${styles.firstSlide}`}>
      <div className={styles.teamBackground}>
        <img 
          src="/pic/radiance_team.avif" 
          alt="Radiance Team" 
          className={styles.image}
        />
      </div>
      
      <div className={styles.teamHeading}>
        <span className={styles.headingLabel}>Meet the team</span>
        <h2>Hello!</h2>
      </div>
    </div>
  );
};

export default GreetingsSlide;