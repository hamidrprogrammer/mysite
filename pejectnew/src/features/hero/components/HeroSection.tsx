import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/HeroSection.module.css';
import useHeroTextAnimation from '../hooks/useHeroTextAnimation';
import useTextLinkHoverAnimation from '../hooks/useTextLinkHoverAnimation';
import useLetterSpriteAnimation from '../hooks/useLetterSpriteAnimation';
import useHeroVideoManager from '../hooks/useHeroVideoManager';
import HaloAnimation from './HaloAnimation'; // Import the HaloAnimation component
import gsap from 'gsap';

interface HeroSectionProps {
  isPreloaderComplete: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isPreloaderComplete }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const heroMaskPart1Ref = useRef<HTMLDivElement>(null);
  const heroMaskPart2Ref = useRef<HTMLDivElement>(null);

  useHeroTextAnimation({
    headingRef,
    maskPart1Ref:heroMaskPart1Ref,
    maskPart2Ref:heroMaskPart2Ref,
    isPreloaderComplete
  });

  const [localTime, setLocalTime] = useState("Loading time...");

  const headingLinksArrayRef = useRef<(HTMLSpanElement | null)[]>([]);
  useTextLinkHoverAnimation(headingLinksArrayRef);

  headingLinksArrayRef.current = [];
  const addHeadingLinkRef = (el: HTMLSpanElement | null) => {
    if (el && !headingLinksArrayRef.current.includes(el)) {
        headingLinksArrayRef.current.push(el);
    }
  };

  const lettersWrapperRef = useRef<HTMLDivElement>(null);
  const letterContainersRef = useRef<Array<HTMLDivElement | null>>([]);
  const spriteContainersRef = useRef<Array<HTMLDivElement | null>>([]);

  useLetterSpriteAnimation({
    letterContainersRef,
    spriteContainersRef,
    isReady: isPreloaderComplete
  });

  letterContainersRef.current = []; // Clear refs array for re-population
  spriteContainersRef.current = []; // Clear refs array for re-population

  const localTimeRef = useRef<HTMLDivElement>(null);
  const localPlaceRef = useRef<HTMLDivElement>(null);
  const descriptorRef = useRef<HTMLDivElement>(null);
  const socialLinksRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  socialLinksRefs.current = []; // Clear for re-population on re-renders
  const addSocialLinkRef = (el: HTMLAnchorElement | null) => {
    if (el && !socialLinksRefs.current.includes(el)) {
      socialLinksRefs.current.push(el);
    }
  };
  const tapHaloTextRef = useRef<HTMLDivElement>(null);


  // Refs for videos and video trigger links
  const videoPlayerRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { setActiveVideoIndex } = useHeroVideoManager({ videoRefs: videoPlayerRefs, initialActiveIndex: 0 });

  // Refs for the text links that trigger video changes
  const designBrandingLinkRef = useRef<HTMLSpanElement>(null);
  const advertisingLinkRef = useRef<HTMLSpanElement>(null);
  const webDevelopmentLinkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const linksAndVideos = [
      { link: designBrandingLinkRef.current, videoIndex: 0 }, // Assuming video 0 is for design/branding
      { link: advertisingLinkRef.current, videoIndex: 1 },    // Assuming video 1 is for advertising
      { link: webDevelopmentLinkRef.current, videoIndex: 2 } // Assuming video 2 is for web dev
    ];

    linksAndVideos.forEach(item => {
      if (item.link) {
        const handleMouseEnter = () => setActiveVideoIndex(item.videoIndex);
        item.link.addEventListener('mouseenter', handleMouseEnter);
        // No mouseleave needed if we want the video to stay until another is triggered
        return () => {
          item.link?.removeEventListener('mouseenter', handleMouseEnter);
        };
      }
    });
  }, [isPreloaderComplete, setActiveVideoIndex]); // Rerun if isPreloaderComplete changes, to ensure listeners are attached after elements are visible

  useEffect(() => {
    const timerId = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (isPreloaderComplete) { // Only run animations after preloader is done
      const letters = letterContainersRef.current.filter(el => el);
      const sprites = spriteContainersRef.current.filter(el => el);

      if (letters.length > 0) {
        gsap.set(letters, { autoAlpha: 0, yPercent: 20 }); // Initial state for letters
        gsap.to(letters, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.8, // Delay slightly after heading text mask reveal
        });
      }
      // Sprites initial state is handled by useLetterSpriteAnimation hook now
      // gsap.set(sprites, { autoAlpha: 0 });

      // Animate bottom wrapper elements
      const bottomElements = [
        localTimeRef.current,
        localPlaceRef.current,
        descriptorRef.current,
        ...socialLinksRefs.current,
      ].filter(el => el);

      if (bottomElements.length > 0) {
        gsap.set(bottomElements, { autoAlpha: 0, y: 20 }); // Initial state for bottom elements
        gsap.to(bottomElements, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 1.2, // Delay after main heading and letters animation
        });
      }

      // Animation for "TAP HALO" text
      if (tapHaloTextRef.current) {
        gsap.set(tapHaloTextRef.current, { autoAlpha: 0 });
        gsap.to(tapHaloTextRef.current, {
            autoAlpha: 1,
            duration: 0.5,
            delay: 1.8 // After bottom elements
        });
      }
    }
  }, [isPreloaderComplete]);

  // Inline SVG components (consider moving to separate files)
  const LetterR = () => <svg width="14.9375em" height="16.6875em" viewBox="0 0 239 267" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 266.058V0H134.976C193.73 0 230.65 28.1942 230.65 78.229C230.65 121.513 203.258 147.325 155.223 149.707V152.884C176.66 159.635 187.379 172.739 197.303 192.197L238.59 266.058H189.761L149.268 194.58C136.564 171.548 126.242 160.826 95.2773 160.826H42.8748V266.058H0ZM42.8748 128.264H137.755C175.072 128.264 187.776 115.557 187.776 83.3913C187.776 52.0203 175.072 38.5188 137.755 38.5188H42.8748V128.264Z" fill="currentColor"></path></svg>;
  const LetterA = () => <svg width="18.4375em" height="16.6875em" viewBox="0 0 295 267" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M244.545 266.058L215.168 196.962H78.2068L48.8296 266.058H0L116.318 0H177.851L294.169 266.058H244.545ZM94.8803 158.443H198.891L162.765 73.8609L148.474 39.7101H145.298L131.006 73.8609L94.8803 158.443Z" fill="currentColor"></path></svg>;
  const LetterD = () => <svg width="15.875em" height="16.6875em" viewBox="0 0 254 267" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M118.7 0C201.273 0 253.279 50.829 253.279 133.029C253.279 215.229 201.273 266.058 118.7 266.058H0V0H118.7ZM118.7 227.539C182.615 227.539 207.625 201.33 207.625 133.029C207.625 64.7275 182.615 38.5188 118.7 38.5188H42.8748V227.539H118.7Z" fill="currentColor"></path></svg>;
  const LetterI = () => <svg width="2.6875em" height="16.6875em" viewBox="0 0 43 267" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 266.058V0H42.8748V266.058H0Z" fill="currentColor"></path></svg>;
  const LetterN = () => <svg width="15.0625em" height="16.6875em" viewBox="0 0 241 267" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 266.058V0H46.0508L194.922 199.742H197.7V0H240.575V266.058H194.525L45.6537 69.4928H42.8749V266.058H0Z" fill="currentColor"></path></svg>;
  const LetterC = () => <svg width="16.5em" height="16.6875em" viewBox=" 0 0 264 274" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M134.976 274C53.9905 274 0 219.994 0 137C0 54.0058 53.9905 0 134.976 0C215.168 0 263.997 39.7101 263.997 103.643V108.806H218.741V103.643C218.741 59.9623 194.128 41.6956 134.976 41.6956C72.649 41.6956 45.6537 67.9044 45.6537 137C45.6537 206.096 72.649 232.304 134.976 232.304C194.128 232.304 218.741 214.038 218.741 170.357V165.194H263.997V170.357C263.997 234.29 215.565 274 134.976 274Z" fill="currentColor"></path></svg>;
  const LetterE = () => <svg width="13.125em" height="16.6875em" viewBox="0 0 210 267" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M209.61 38.5188H42.8749V112.777H203.655V151.693H42.8749V227.539H209.61V266.058H0V0H209.61V38.5188Z" fill="currentColor"></path></svg>;

  return (
    <section id="hero-section" className={`${styles.heroSection} hero-section`}>
      <HaloAnimation />
      {/* Add the "TAP HALO" text, possibly controlled by HaloAnimation or its own state */}
      <div className={styles.tapHaloTextContainer}> {/* Use a specific container if needed */}
        <div ref={tapHaloTextRef} className={styles.tapHaloText}>♪ TAP HALO ♪</div>
      </div>
      <div className={`${styles.headingWrapper} heading-wrapper`}>
        <h2 className={`${styles.heroHeading} hero-heading`} ref={headingRef}>
          <span className={styles.notHoverable} ref={addHeadingLinkRef}>We live our best lives excelling at </span>
          <span className={`${styles.headingLink} heading-link`} ref={el => { addHeadingLinkRef(el); designBrandingLinkRef.current = el; }}>design and branding,</span><br />
          <span className={`${styles.headingLink} heading-link`} ref={el => { addHeadingLinkRef(el); advertisingLinkRef.current = el; }}>advertising,</span>{' '}
          <span className={`${styles.headingLink} heading-link`} ref={el => { addHeadingLinkRef(el); webDevelopmentLinkRef.current = el; }}>web development</span>
          <span className={styles.notHoverable} ref={addHeadingLinkRef}> and everything we touch</span>
          <div className={`${styles.heroMask} hero-mask`}>
            <div className={styles.heroMaskPart} ref={heroMaskPart1Ref}></div>
            <div className={styles.heroMaskPart} ref={heroMaskPart2Ref}></div>
          </div>
        </h2>
        <h2 className={`${styles.heroHeadingMobile} hero-heading-mobile`}>
          We live our best lives excelling at design and branding, advertising, web development and everything we touch
        </h2>
      </div>

      <div className={`${styles.bottomWrapper} bottom-wrapper`}>
        <div className={`${styles.bottomLinksWrapper} bottom-links-wrapper`}>
          <div>
            <div className={`${styles.welcome} welcome`} id="local-time" ref={localTimeRef}>{localTime}</div>
            <div className={`${styles.welcome} welcome`} id="local-place" ref={localPlaceRef}>DRESDEN, GERMANY</div>
          </div>
          <div className={styles.divider}></div>
          <div className={`${styles.descriptor} descriptor`} ref={descriptorRef}>
            <div className={`${styles.welcome} welcome`}>DESIGN CREW</div>
          </div>
          <div className={styles.divider}></div>
          <div>
            <a href="https://www.behance.net/Radiancefamily" target="_blank" rel="noopener noreferrer" ref={addSocialLinkRef} className={`${styles.animatedLinkFooter} ${styles.welcome} welcome animated-link`}>
              <span>BEHANCE</span>
            </a>
            <a href="https://www.instagram.com/designbyradiance/" target="_blank" rel="noopener noreferrer" ref={addSocialLinkRef} className={`${styles.animatedLinkFooter} ${styles.welcome} welcome animated-link`}>
              <span>INSTAGRAM</span>
            </a>
            <a href="https://dprofile.ru/radiance" target="_blank" rel="noopener noreferrer" ref={addSocialLinkRef} className={`${styles.animatedLinkFooter} ${styles.welcome} welcome animated-link`}>
              <span>DPROFILE</span>
            </a>
          </div>
        </div>

        <div className={`${styles.lettersWrapper} letters-wrapper`} ref={lettersWrapperRef}>
          <div id="letter-r" className={styles.letterContainer} ref={el => letterContainersRef.current[0] = el}><LetterR /></div>
          <div id="letter-a" className={styles.letterContainer} ref={el => letterContainersRef.current[1] = el}><LetterA /></div>
          <div id="letter-d" className={styles.letterContainer} ref={el => letterContainersRef.current[2] = el}><LetterD /></div>
          <div id="letter-i" className={styles.letterContainer} ref={el => letterContainersRef.current[3] = el}><LetterI /></div>
          <div id="letter-a-s" className={styles.letterContainer} ref={el => letterContainersRef.current[4] = el}><LetterA /></div>
          <div id="letter-n" className={styles.letterContainer} ref={el => letterContainersRef.current[5] = el}><LetterN /></div>
          <div id="letter-c" className={styles.letterContainer} ref={el => letterContainersRef.current[6] = el}><LetterC /></div>
          <div id="letter-e" className={styles.letterContainer} ref={el => letterContainersRef.current[7] = el}><LetterE /></div>
        </div>

        <div className={`${styles.spriteWrapper} sprite-wrapper`}>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[0] = el}><img className={styles.sprite} src="/pic/sprites/r.avif" alt="R Letter" /></div>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[1] = el}><img className={styles.sprite} src="/pic/sprites/a_1.avif" alt="A Letter" /></div>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[2] = el}><img className={styles.sprite} src="/pic/sprites/d.avif" alt="D Letter" /></div>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[3] = el}><img className={styles.sprite} src="/pic/sprites/i.avif" alt="I Letter" /></div>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[4] = el}><img className={styles.sprite} src="/pic/sprites/aa.avif" alt="A Letter" /></div>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[5] = el}><img className={styles.sprite} src="/pic/sprites/n.avif" alt="N Letter" /></div>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[6] = el}><img className={styles.sprite} src="/pic/sprites/c.avif" alt="C Letter" /></div>
          <div className={styles.spriteContainer} ref={el => spriteContainersRef.current[7] = el}><img className={styles.sprite} src="/pic/sprites/e.avif" alt="E Letter" /></div>
        </div>
      </div>

      <div className={`${styles.backgroundVideoWrapper} background-video-wrapper`}>
        <video ref={el => videoPlayerRefs.current[0] = el} id="background-video-1" preload="auto" loop muted playsInline disablePictureInPicture controlsList="nodownload" className={styles.heroVideo}>
          <source src="/video/branding-portfolio.webm" type="video/webm" />
          <source src="/video/branding-portfolio.mp4" type="video/mp4" />
        </video>
        <video ref={el => videoPlayerRefs.current[1] = el} id="background-video-2" preload="auto" loop muted playsInline disablePictureInPicture controlsList="nodownload" className={styles.heroVideo}>
          <source src="/video/ads-portfolio.webm" type="video/webm" />
          <source src="/video/ads-portfolio.mp4" type="video/mp4" />
        </video>
        <video ref={el => videoPlayerRefs.current[2] = el} id="background-video-3" preload="auto" loop muted playsInline disablePictureInPicture controlsList="nodownload" className={styles.heroVideo}>
          <source src="/video/web-portfolio.webm" type="video/webm" />
          <source src="/video/web-portfolio.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={`${styles.mobileLettersLottieContainer} mobile-letters-lottie-container`}>
        {/* Lottie animation will be integrated here */}
      </div>
    </section>
  );
};

export default HeroSection;
