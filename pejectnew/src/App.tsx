import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import Preloader from './features/preloader/components/Preloader';
import Header from './features/navigation/components/Header';
import Menu from './features/navigation/components/Menu';
import HeroSection from './features/hero/components/HeroSection';
import PresentationSection from './features/presentation/components/PresentationSection';
import PortfolioSection from './features/portfolio/components/PortfolioSection';
import Footer from './features/footer/components/Footer'; // Import Footer

const App: React.FC = () => {
  const [isPreloaderAnimationComplete, setIsPreloaderAnimationComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Add classes to HTML element
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // gestureDirection: 'vertical', // self-explanatory
      // smooth: true, // DEPRECATED
      // smoothTouch: false, // DEPRECATED
      // touchMultiplier: 2, // DEPRECATED
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      lenisRef.current = null;
    };
  }, []);


  const handlePreloaderAnimationComplete = () => {
    setIsPreloaderAnimationComplete(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleNavigation = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // section.scrollIntoView({ behavior: 'smooth' }); // Native smooth scroll
      lenisRef.current?.scrollTo(section, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
    setIsMenuOpen(false); // Close menu after navigation
  };

  useEffect(() => {
    if (isMenuOpen) {
      lenisRef.current?.stop();
      // document.body.style.overflow = 'hidden'; // Lenis handles this
    } else {
      lenisRef.current?.start();
      // document.body.style.overflow = 'auto'; // Lenis handles this
    }
  }, [isMenuOpen]);


  if (!isPreloaderAnimationComplete) {
    return <Preloader onAnimationComplete={handlePreloaderAnimationComplete} />;
  }

  return (
    <>
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <Menu isOpen={isMenuOpen} onCloseMenu={toggleMenu} onNavigate={handleNavigation} />

      <main>
        {/* Pass isPreloaderComplete to HeroSection to trigger its animations */}
        <HeroSection isPreloaderComplete={isPreloaderAnimationComplete} />
        <PresentationSection isReady={isPreloaderAnimationComplete} />
        <PortfolioSection isReady={isPreloaderAnimationComplete} />

        {/* Placeholder for other sections to test navigation */}
        {/* <section id="presentation-section" style={{ height: '100vh', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white, #F3F3EF)' }}>
          <h1>Presentation Section (Meet Radiance)</h1>
        </section> */}
        {/* <section id="estimates-slide" style={{ height: '100vh', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white, #F3F3EF)' }}>
          <h1>Estimates Slide (Our Approach)</h1>
        </section> */}
        {/* <section id="portfolio-section" style={{ height: '100vh', backgroundColor: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white, #F3F3EF)' }}>
          <h1>Portfolio Section (Selected Works)</h1>
        </section> */}
        {/* <section id="footer" style={{ height: '100vh', backgroundColor: 'var(--black, #060606)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white, #F3F3EF)' }}>
          <h1>Footer Section (Contacts)</h1>
        </section> */}
      </main>
      <Footer />
    </>
  );
};

export default App;
