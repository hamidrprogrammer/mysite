import React from 'react';
import styles from '../../styles/slides/GreetingsSlide.module.css'; // To be created

const GreetingsSlide: React.FC = () => {
  return (
    <div id="greetings-slide" className={`${styles.slide} ${styles.firstSlide} slide first`}> {/* Keep original classes for now if needed by global CSS or structure */}
      <div className={styles.teamHeading}>
        <div className={styles.headingLabel}>GREETINGS</div>
        <h2>MEET WITH OUR<br />OUTSTANDING TEAM</h2>
      </div>
      <div className={styles.teamBackground}>
        <img src="/pic/radiance_team.avif" loading="lazy" alt="Radiance Team" className={styles.image} />
      </div>
    </div>
  );
};

export default GreetingsSlide;
