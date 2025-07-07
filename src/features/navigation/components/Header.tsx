import React from 'react';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
}

const BriefStarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 0L9.798 6.202L16 8L9.798 9.798L8 16L6.202 9.798L0 8L6.202 6.202L8 0Z" fill="currentColor"/>
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className={styles.appHeader}>
      <nav className={styles.appNav}>
        <div className={styles.briefLinkContainer}>
          <a href="#" className={styles.animatedLink}>
            <div className={styles.animatedLinkInner}>
              <span>Brief</span>
            </div>
          </a>
          <BriefStarIcon />
        </div>

        <div className={styles.navEnd}>
          <a href="#" className={styles.animatedLink}>
            <div className={styles.animatedLinkInner}>
              <span>En</span>
            </div>
          </a>
          <button 
            onClick={onMenuToggle}
            className={`${styles.animatedLink} ${styles.menuButton}`}
          >
            <span>Menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;