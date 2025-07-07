import React, { useState, useEffect } from 'react';
import Preloader from './features/preloader/components/Preloader';
import Header from './features/navigation/components/Header';
import Menu from './features/navigation/components/Menu';
import HeroSection from './features/hero/components/HeroSection';
import PresentationSection from './features/presentation/components/PresentationSection';
import PortfolioSection from './features/portfolio/components/PortfolioSection';
import Footer from './features/footer/components/Footer';

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
    // Body scroll lock logic when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  if (!isPreloaderAnimationComplete) {
    return <Preloader onAnimationComplete={handlePreloaderAnimationComplete} />;
  }

  return (
    <>
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <Menu isOpen={isMenuOpen} onCloseMenu={toggleMenu} onNavigate={handleNavigation} />

      <main>
        <HeroSection isPreloaderComplete={isPreloaderAnimationComplete} />
        <PresentationSection isReady={isPreloaderAnimationComplete} />
        <PortfolioSection isReady={isPreloaderAnimationComplete} />
      </main>
      <Footer />
    </>
  );
};

export default App;