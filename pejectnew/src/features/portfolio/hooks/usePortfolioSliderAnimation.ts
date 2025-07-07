import { useEffect, useRef, Dispatch, SetStateAction } from 'react';
import gsap from 'gsap';
// import Draggable from 'gsap/Draggable'; // If drag functionality is desired later
// gsap.registerPlugin(Draggable);

interface PortfolioItem {
  id: string;
  title: string;
  subTitle?: string;
  tags?: string[];
  imageUrl?: string;
  behanceUrl: string;
  year?: string;
}

interface UsePortfolioSliderAnimationProps {
  items: PortfolioItem[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>; // To allow hook to change index if needed (e.g. for drag)
  cardsContainerRef: RefObject<HTMLDivElement>; // Container of all TiltCard components
  cardRefs: RefObject<(HTMLDivElement | null)[]>; // Refs to individual TiltCard containers
  tagARef: RefObject<HTMLHeadingElement>;
  tagBRef: RefObject<HTMLHeadingElement>;
  projectNameARef: RefObject<HTMLHeadingElement>;
  projectNameBRef: RefObject<HTMLHeadingElement>;
  projectYearRef: RefObject<HTMLDivElement>;
  isReady?: boolean; // To sync with PortfolioWelcome animation
}

const usePortfolioSliderAnimation = ({
  items,
  activeIndex,
  // setActiveIndex, // Not used in this basic version, but could be for drag
  cardsContainerRef,
  cardRefs, // This should be an array of refs to the .tilt-card-container divs
  tagARef,
  tagBRef,
  projectNameARef,
  projectNameBRef,
  projectYearRef,
  isReady = true,
  // Add sectionRef for pinning
  sectionRef,
}: UsePortfolioSliderAnimationProps & { sectionRef: RefObject<HTMLElement> }) => {

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!isReady || !cardsContainerRef.current || items.length === 0 || !sectionRef.current) return;

    const cards = cardRefs.current?.filter((el): el is HTMLDivElement => el !== null) || [];
    if (cards.length !== items.length) return;

    // Pin the section - This should ideally be managed at PortfolioSection level or passed in
    // For now, let's assume this hook also handles the pinning of its parent section.
    // The duration of the pin should be enough for users to interact with the slider if it's not scroll-driven.
    // If the slider itself is animated by scroll, the pin duration would be tied to that.
    // Since this slider is controlled by activeIndex (clicks), pin duration is arbitrary.

    scrollTriggerInstanceRef.current?.kill(); // Kill previous ScrollTrigger
    scrollTriggerInstanceRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      start: "top top",
      // End after a certain amount of scroll, e.g., 200% of viewport height
      // This allows page to continue scrolling after this section is "done".
      end: "+=150%",
      // markers: true, // for debugging
    });


    timelineRef.current?.kill();
    timelineRef.current = gsap.timeline();

    const currentItem = items[activeIndex];

    // Animate text changes
    // Hide old text, change content, then reveal new text
    const textElements = [tagARef.current, tagBRef.current, projectNameARef.current, projectNameBRef.current, projectYearRef.current].filter(Boolean);

    timelineRef.current.to(textElements, { autoAlpha: 0, yPercent: -20, duration: 0.25, ease: 'power1.in' })
      .call(() => {
        if (tagARef.current && currentItem?.tags?.[0]) tagARef.current.textContent = currentItem.tags[0]; else if (tagARef.current) tagARef.current.textContent = "";
        if (tagBRef.current && currentItem?.tags?.[1]) tagBRef.current.textContent = currentItem.tags[1]; else if (tagBRef.current) tagBRef.current.textContent = "";
        if (projectNameARef.current && currentItem?.title) projectNameARef.current.textContent = currentItem.title;
        if (projectNameBRef.current && currentItem?.subTitle) projectNameBRef.current.textContent = currentItem.subTitle; else if (projectNameBRef.current) projectNameBRef.current.textContent = "";
        if (projectYearRef.current && currentItem?.year) projectYearRef.current.textContent = currentItem.year;
      })
      .to(textElements, { autoAlpha: 1, yPercent: 0, duration: 0.35, ease: 'power1.out', stagger: 0.05 });

    // Card stack animation
    cards.forEach((card, index) => {
      const offset = index - activeIndex;
      let targetProps: gsap.TweenVars = {};

      if (offset === 0) { // Active card
        targetProps = {
          xPercent: 0,
          yPercent: 0, // Ensure active card is vertically centered if others are offset by y
          scale: 1,
          rotateZ: 0,
          autoAlpha: 1,
        };
      } else { // Non-active cards - stacked effect
        const stackOffset = Math.abs(offset); // How far from active
        targetProps = {
          xPercent: 0,
          y: `${stackOffset * 20}px`, // Stack them below the active card; adjust 20px as needed
          scale: Math.max(1 - stackOffset * 0.05, 0.7), // Decrease scale for cards further in stack
          rotateZ: 0, // No rotation for a clean stack, or minimal (e.g., offset * 1 or 2)
          autoAlpha: (stackOffset < 3) ? (1 - stackOffset * 0.25) : 0, // Show 2 cards behind, then fade
          // zIndex is handled by the TiltCard component via prop, ensuring correct stacking order
        };
      }

      timelineRef.current.to(card, {
        ...targetProps,
        duration: 0.6, // Duration for card transition
        ease: 'power2.inOut',
      }, "<0.1"); // Slight overlap for smoother transitions between cards
    });

    return () => {
        timelineRef.current?.kill();
        scrollTriggerInstanceRef.current?.kill();
        cards.forEach(card => gsap.set(card, { clearProps: "all" }));
    };

  }, [activeIndex, items, cardsContainerRef, cardRefs, tagARef, tagBRef, projectNameARef, projectNameBRef, projectYearRef, isReady, sectionRef]);

  return {
    // The hook currently doesn't need to return anything as it directly animates.
    // If it controlled activeIndex via drag, it would return handlers.
  };
};

export default usePortfolioSliderAnimation;
