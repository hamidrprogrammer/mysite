import React, { useRef } from 'react';
import styles from '../styles/Footer.module.css';
import useGodraysEffect from '../hooks/useGodraysEffect'; // Import the Godrays hook

// Mobile Arrow Icon (can be a shared component if used elsewhere)
const ArrowIconMobile = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.96074 1.80252L0 8.76327L1.23673 10L8.19718 3.03955V9.38153H9.94619L9.94626 1.29047L10 1.23673L9.94626 1.18299L9.94626 0.053524L8.81679 0.0535202L8.76327 0L8.70975 0.0535202L0.618255 0.0535244V1.80252L6.96074 1.80252Z" fill="currentColor"></path>
  </svg>
);


const Footer: React.FC = () => {
  const oglCanvasContainerRef = useRef<HTMLDivElement>(null);
  useGodraysEffect({ containerRef: oglCanvasContainerRef, isActive: true }); // Activate the effect

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.footerLayout}>
        <div className={styles.emailContainer}>
          <a href="mailto:hello@radiance.family?subject=Let's%20share%20Radiance%20together" className={`${styles.footerEmailLink} ${styles.long}`}>
            <h1 className={styles.footerHeading}>HELLO@RADIANCE.FAMILY</h1>
          </a>
          <div className={`${styles.short} ${styles.footerTapHalo}`}>♪ TAP HALO ♪</div>
          <h1 className={`${styles.footerHeading} ${styles.short}`}>LET'S SHADE A LIGHT ON YOUR PROJECT</h1>
        </div>

        <div className={styles.footerSocialLinks}>
          <a className={`${styles.animatedLink} animated-link`} href="/privacy"> {/* Assuming /privacy is a valid link */}
            <span>PRIVACY POLICY</span>
          </a>
          <div className={styles.footerSocialSecondContainer}>
            <a className={`${styles.animatedLink} animated-link`} href="https://www.behance.net/Radiancefamily" target="_blank" rel="noopener noreferrer">
              <span>BEHANCE</span>
            </a>
            <a className={`${styles.animatedLink} animated-link`} href="https://www.instagram.com/designbyradiance/" target="_blank" rel="noopener noreferrer">
              <span>INSTAGRAM</span>
            </a>
            <a className={`${styles.animatedLink} animated-link`} href="https://linkedin.com/company/designbyradiance" target="_blank" rel="noopener noreferrer">
              <span>LINKEDIN</span>
            </a>
          </div>
        </div>

        {/* Mobile specific link buttons */}
        <div className={`${styles.menuLinkButtonsMobile} ${styles.short} menu-link-buttons short`}>
          <a href="mailto:hello@radiance.family?subject=Let's%20share%20Radiance%20together" className={`${styles.menuButtonLink} ${styles.pinkAccent} ${styles.wide}`}>
            <div className={styles.textBlock}>HELLO@RADIANCE.FAMILY</div>
            <ArrowIconMobile />
          </a>
          <a href="https://www.instagram.com/designbyradiance/" target="_blank" rel="noopener noreferrer" className={styles.menuButtonLink}>
            <div className={styles.textBlock}>INSTAGRAM</div>
            <ArrowIconMobile />
          </a>
          <a href="https://t.me/Arturkay" target="_blank" rel="noopener noreferrer" className={styles.menuButtonLink}>
            <div className={styles.textBlock}>TELEGRAM</div>
            <ArrowIconMobile />
          </a>
          <a href="https://www.behance.net/Radiancefamily" target="_blank" rel="noopener noreferrer" className={styles.menuButtonLink}>
            <div className={styles.textBlock}>BEHANCE</div>
            <ArrowIconMobile />
          </a>
          <a href="https://www.linkedin.com/company/designbyradiance/" target="_blank" rel="noopener noreferrer" className={styles.menuButtonLink}>
            <div className={styles.textBlock}>LINKEDIN</div>
            <ArrowIconMobile />
          </a>
        </div>
      </div>

      {/* OGL Godrays Canvas Placeholder */}
      <div ref={oglCanvasContainerRef} className={`${styles.canvasEmbed} ${styles.oglGodrays} canvas-embed ogl-godrays`}>
        <div className={`${styles.canvasWrapper} canvas-wrapper`}>
          {/* Canvas will be injected here by the hook */}
          {/* <canvas id="ogl-canvas"></canvas> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
