import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/Preloader.module.css';
import usePreloaderAnimation from '../hooks/usePreloaderAnimation';

interface PreloaderProps {
  onAnimationComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onAnimationComplete }) => {
  const [pageIsReadyForHook, setPageIsReadyForHook] = useState(false);

  useEffect(() => {
    // This simulates the DOMContentLoaded or equivalent for React
    // In a real app, this might be tied to data fetching, asset loading, etc.
    const handleLoad = () => {
      setPageIsReadyForHook(true);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad); // 'load' is a more reliable event for all assets
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const {
    preloaderWrapperRef,
    preloaderBackgroundRef,
    preloaderCounterRef,
    counterDigitsRef,
    counterImageRef
  } = usePreloaderAnimation({
    onAnimationComplete,
    pageIsReady: pageIsReadyForHook
  });

  // Assign refs to elements directly. The hook will use these.
  // Note: The hook also tries to find them by ID as a fallback, which is not ideal for React.
  // It's better to pass refs directly if the hook is modified to accept them.
  // For now, the hook's ID-based selectors will work with the current HTML structure.

  return (
    // The hook uses document.getElementById, so we ensure IDs are present.
    // Ideally, the hook should accept refs for these elements.
    <div id="preloader-wrapper" ref={preloaderWrapperRef} className={`${styles.preloaderWrapper} preloader-wrapper`}>
      <div id="preloader-counter" ref={preloaderCounterRef} className={`${styles.preloaderCounter} preloader-counter`}>
        <div id="counter1" ref={el => counterDigitsRef.current[0] = el} className={styles.counterDigitContainer}>
          <img id="counter1-pic" ref={counterImageRef} className={`${styles.counterPic} counter-pic`} src="/pic/counter_1.svg" loading="eager" alt="Counter 1" />
        </div>
        <div id="counter2" ref={el => counterDigitsRef.current[1] = el} className={styles.counterDigitContainer}>
          <img className={`${styles.counterPic} counter-pic`} src="/pic/counter_2.svg" loading="eager" alt="Counter 2" />
        </div>
        <div id="counter3" ref={el => counterDigitsRef.current[2] = el} className={styles.counterDigitContainer}>
          <img className={`${styles.counterPic} counter-pic`} src="/pic/counter_3.svg" loading="eager" alt="Counter 3" />
        </div>
      </div>
      <div className={`${styles.preloaderHaloMobile} preloader-halo-mobile`}> {/* This is queried by class in hook */}
        <img src="/halo.png" alt="Preloader Halo Mobile"/>
      </div>
      <div id="preloader-background" ref={preloaderBackgroundRef} className={`${styles.preloaderBackground} preloader-background`}></div>
    </div>
  );
};

export default Preloader;
