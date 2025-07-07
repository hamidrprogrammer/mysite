import React from 'react';
import PortfolioSlider from './PortfolioSlider';
import PortfolioWelcome from './PortfolioWelcome';
import styles from '../styles/PortfolioSection.module.css';

const PortfolioSection: React.FC = () => {
  return (
    <section className={styles.portfolioSection}>
      <PortfolioWelcome />
      <div className={styles.portfolioSliderLayout}>
        <PortfolioSlider />
      </div>
    </section>
  );
};

export default PortfolioSection;