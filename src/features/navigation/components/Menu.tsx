import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/Menu.module.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArrowIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const menuDesktopRef = useRef<HTMLDivElement>(null);
  const menuMobileRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 767;
    const menuRef = isMobile ? menuMobileRef : menuDesktopRef;

    if (isOpen) {
      const tl = gsap.timeline();
      
      if (backdropRef.current) {
        tl.set(backdropRef.current, { visibility: 'visible' })
          .to(backdropRef.current, { opacity: 1, duration: 0.3 });
      }

      if (backgroundRef.current && !isMobile) {
        tl.set(backgroundRef.current, { visibility: 'visible' })
          .fromTo(backgroundRef.current, 
            { width: 0, height: 0 },
            { width: '260px', height: 'auto', duration: 0.4, ease: 'power2.out' }
          );
      }

      if (menuRef.current) {
        tl.set(menuRef.current, { visibility: 'visible', display: isMobile ? 'block' : 'flex' })
          .fromTo(menuRef.current,
            { opacity: 0, x: isMobile ? '100%' : 0 },
            { opacity: 1, x: 0, duration: 0.3 }
          );
      }
    } else {
      const tl = gsap.timeline();
      
      if (menuRef.current) {
        tl.to(menuRef.current, {
          opacity: 0,
          x: isMobile ? '100%' : 0,
          duration: 0.3,
          onComplete: () => {
            if (menuRef.current) {
              menuRef.current.style.visibility = 'hidden';
              menuRef.current.style.display = 'none';
            }
          }
        });
      }

      if (backgroundRef.current && !isMobile) {
        tl.to(backgroundRef.current, {
          width: 0,
          height: 0,
          duration: 0.3,
          onComplete: () => {
            if (backgroundRef.current) {
              backgroundRef.current.style.visibility = 'hidden';
            }
          }
        }, 0);
      }

      if (backdropRef.current) {
        tl.to(backdropRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            if (backdropRef.current) {
              backdropRef.current.style.visibility = 'hidden';
            }
          }
        }, 0);
      }
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={`${styles.menuBackdrop} ${styles.bgNoise}`}
        onClick={onClose}
      />

      {/* Desktop Menu */}
      <div ref={menuDesktopRef} className={styles.menuDesktop}>
        <div ref={backgroundRef} className={styles.menuBackground} />
        <div className={styles.menuPopupLayout}>
          <div className={styles.menuContent}>
            <div className={styles.menuItems}>
              <a href="#" className={styles.animatedMenuLink}>
                <h2>About</h2>
              </a>
              <a href="#" className={styles.animatedMenuLink}>
                <h2>Works</h2>
              </a>
              <a href="#" className={styles.animatedMenuLink}>
                <h2>Contact</h2>
              </a>
            </div>

            <div className={styles.menuLinks}>
              <div className={styles.linkItem}>
                <a href="#">Privacy Policy</a>
                <ArrowIcon />
              </div>
              <div className={styles.menuDivider} />
              <div className={styles.linkItem}>
                <a href="#">Behance</a>
                <ArrowIcon />
              </div>
              <div className={styles.linkItem}>
                <a href="#">Instagram</a>
                <ArrowIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={menuMobileRef} className={styles.menuMobile}>
        <div className={styles.mobileMenuLayout}>
          <div className={styles.topSpacer} />
          
          <div className={styles.menuItems}>
            <a href="#" className={styles.animatedMenuLink}>
              <h3>About</h3>
            </a>
            <a href="#" className={styles.animatedMenuLink}>
              <h3>Works</h3>
            </a>
            <a href="#" className={styles.animatedMenuLink}>
              <h3>Contact</h3>
            </a>
          </div>

          <div className={styles.menuLinkButtons}>
            <a href="#" className={`${styles.menuButtonLink} ${styles.blueAccent} ${styles.wide}`}>
              <span>Privacy Policy</span>
              <ArrowIcon />
            </a>
            <a href="#" className={styles.menuButtonLink}>
              <span>Behance</span>
              <ArrowIcon />
            </a>
            <a href="#" className={`${styles.menuButtonLink} ${styles.pinkAccent}`}>
              <span>Instagram</span>
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;