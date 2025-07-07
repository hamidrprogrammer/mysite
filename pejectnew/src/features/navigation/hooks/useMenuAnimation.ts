import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface UseMenuAnimationProps {
  isOpen: boolean;
}

const useMenuAnimation = ({ isOpen }: UseMenuAnimationProps) => {
  const desktopMenuRef = useRef<HTMLElement>(null);
  const menuBackdropRef = useRef<HTMLDivElement>(null);
  const menuBackgroundRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null); // Ref for the content area of desktop menu
  const desktopMenuItemsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const desktopMenuLinksRef = useRef<Array<HTMLDivElement | null>>([]);
  const menuDividerRef = useRef<HTMLDivElement>(null);

  const mobileMenuRef = useRef<HTMLElement>(null);
  const mobileMenuItemsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const mobileMenuLinkButtonsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  const [isMobileView, setIsMobileView] = useState(window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = () => setIsMobileView(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    // Ensure refs are populated by Menu.tsx
    // Desktop Menu Animations
    if (desktopMenuRef.current && menuBackdropRef.current && menuBackgroundRef.current && menuContentRef.current) {
      gsap.killTweensOf([desktopMenuRef.current, menuBackdropRef.current, menuBackgroundRef.current, menuContentRef.current, desktopMenuItemsRef.current, desktopMenuLinksRef.current, menuDividerRef.current]);

      const tlDesktop = gsap.timeline({ paused: true });

      // Initial states (some might be set by CSS module, but GSAP can ensure them)
      gsap.set(desktopMenuRef.current, { autoAlpha: 0, display: 'none' });
      gsap.set(menuBackdropRef.current, { autoAlpha: 0 });
      gsap.set(menuBackgroundRef.current, { autoAlpha: 0, scale: 0.95, transformOrigin: "top right"});
      gsap.set(desktopMenuItemsRef.current.filter(el => el), { yPercent: -20, autoAlpha: 0 });
      gsap.set(desktopMenuLinksRef.current.filter(el => el), { yPercent: -20, autoAlpha: 0 });
      gsap.set(menuDividerRef.current, { autoAlpha: 0 });

      tlDesktop
        .to(desktopMenuRef.current, { autoAlpha: 1, display: 'flex', duration: 0.01 })
        .to(menuBackdropRef.current, { autoAlpha: 1, duration: 0.3, ease: 'power1.inOut' })
        .to(menuBackgroundRef.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, "-=0.2")
        .staggerTo(desktopMenuItemsRef.current.filter(el => el), 0.3, { yPercent: 0, autoAlpha: 1, ease: 'circ.out' }, 0.05, "-=0.2")
        .to(menuDividerRef.current, {autoAlpha: 1, duration: 0.3}, "-=0.2")
        .staggerTo(desktopMenuLinksRef.current.filter(el => el), 0.3, { yPercent: 0, autoAlpha: 1, ease: 'circ.out' }, 0.05, "-=0.2");

      if (isOpen && !isMobileView) {
        tlDesktop.play();
      } else {
        tlDesktop.reverse(0).then(() => { // Ensure reverse completes before setting display none
             if (desktopMenuRef.current && !isOpen) gsap.set(desktopMenuRef.current, { display: 'none' });
        });
      }
    }

    // Mobile Menu Animations
    if (mobileMenuRef.current) {
        gsap.killTweensOf([mobileMenuRef.current, mobileMenuItemsRef.current, mobileMenuLinkButtonsRef.current]);
        const tlMobile = gsap.timeline({ paused: true });

        gsap.set(mobileMenuRef.current, { xPercent: 100, autoAlpha: 0, display: 'none' });
        gsap.set(mobileMenuItemsRef.current.filter(el => el), {yPercent: 50, autoAlpha: 0});
        gsap.set(mobileMenuLinkButtonsRef.current.filter(el => el), {autoAlpha: 0});

        tlMobile
            .to(mobileMenuRef.current, { xPercent: 0, autoAlpha: 1, display: 'block', duration: 0.4, ease: 'power2.out' })
            .staggerTo(mobileMenuItemsRef.current.filter(el => el), 0.3, { yPercent: 0, autoAlpha: 1, ease: 'circ.out' }, 0.07, "-=0.2")
            .staggerTo(mobileMenuLinkButtonsRef.current.filter(el => el), 0.3, { autoAlpha: 1, ease: 'power1.in' }, 0.05, "-=0.3");

        if (isOpen && isMobileView) {
            tlMobile.play();
        } else {
            tlMobile.reverse(0).then(() => {
                if (mobileMenuRef.current && !isOpen) gsap.set(mobileMenuRef.current, { display: 'none' });
            });
        }
    }

  }, [isOpen, isMobileView]);

  return {
    desktopMenuRef,
    menuBackdropRef,
    menuBackgroundRef,
    menuContentRef,
    desktopMenuItemsRef,
    desktopMenuLinksRef,
    menuDividerRef,
    mobileMenuRef,
    mobileMenuItemsRef,
    mobileMenuLinkButtonsRef,
  };
};

export default useMenuAnimation;
