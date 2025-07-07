import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize OGL Godrays effect
    if (canvasRef.current) {
      // OGL canvas initialization would go here
      // This is a placeholder for the actual OGL implementation
    }

    // Footer animations
    const footerElements = footerRef.current?.querySelectorAll(`.${styles.footerSocialLinks} > *`);
    if (footerElements) {
      gsap.fromTo(footerElements, {
        y: 50,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      {/* OGL Godrays Canvas */}
      <div ref={canvasRef} className={styles.canvasEmbed}>
        <div className={styles.canvasWrapper}>
          {/* OGL canvas will be injected here */}
        </div>
      </div>

      <div className={styles.footerLayout}>
        {/* Email Container */}
        <div className={styles.emailContainer}>
          <a href="mailto:hello@radiance.studio" className={styles.footerEmailLink}>
            <h1 className={`${styles.footerHeading} ${styles.long}`}>
              hello@radiance.studio
            </h1>
            <h1 className={`${styles.footerHeading} ${styles.short}`}>
              hello@radiance
            </h1>
          </a>
          <div className={styles.footerTapHalo}>
            ♪ TAP HALO ♪
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.footerSocialLinks}>
          <span>© 2024 Radiance Studio</span>
          <div className={styles.footerSocialSecondContainer}>
            <a href="#" className={styles.animatedLink}>
              <span>Privacy Policy</span>
            </a>
            <a href="#" className={styles.animatedLink}>
              <span>Behance</span>
            </a>
            <a href="#" className={styles.animatedLink}>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Buttons */}
        <div className={styles.menuLinkButtonsMobile}>
          <a href="#" className={`${styles.menuButtonLink} ${styles.wide}`}>
            Privacy Policy
          </a>
          <a href="#" className={styles.menuButtonLink}>
            Behance
          </a>
          <a href="#" className={`${styles.menuButtonLink} ${styles.pinkAccent}`}>
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;