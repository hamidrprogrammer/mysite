import React, { useState, useEffect } from 'react';
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

  const handlePreloaderAnimationComplete = () => {
    setIsPreloaderAnimationComplete(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleNavigation = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Logic for body scroll lock can be added here if needed,
    // especially when integrating with a smooth scroll library like Lenis.
    // For example:
    // if (isMenuOpen) {
    //   lenisInstance?.stop(); // If using Lenis
    //   document.body.style.overflow = 'hidden';
    // } else {
    //   lenisInstance?.start();
    //   document.body.style.overflow = 'auto';
    // }
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
