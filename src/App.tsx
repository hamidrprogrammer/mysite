import React, { useEffect, useState } from 'react';
import Preloader from './features/preloader/components/Preloader';
import Header from './features/navigation/components/Header';
import Menu from './features/navigation/components/Menu';
import HeroSection from './features/hero/components/HeroSection';
import PresentationSection from './features/presentation/components/PresentationSection';
import PortfolioSection from './features/portfolio/components/PortfolioSection';
import Footer from './features/footer/components/Footer';
import { initializeLenis } from './utils/lenis';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = initializeLenis();
    
    // Cleanup function
    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="App">
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      
      <Header onMenuToggle={handleMenuToggle} />
      <Menu isOpen={isMenuOpen} onClose={handleMenuClose} />
      
      <main>
        <HeroSection />
        <PresentationSection />
        <PortfolioSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;