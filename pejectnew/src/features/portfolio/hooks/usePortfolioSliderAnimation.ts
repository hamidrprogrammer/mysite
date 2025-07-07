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
}: UsePortfolioSliderAnimationProps) => {

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isReady || !cardsContainerRef.current || items.length === 0) return;

    const cards = cardRefs.current?.filter((el): el is HTMLDivElement => el !== null) || [];
    if (cards.length !== items.length) return; // Ensure all cards are rendered and refs are populated

    timelineRef.current?.kill(); // Kill previous timeline
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
      const isBehind = offset < 0;

      let targetProps: gsap.TweenVars = {
        // transformOrigin: "50% 50%", // Already set by TiltCard.module.css
        // zIndex: items.length - Math.abs(offset), // Already handled by TiltCard prop
      };

      if (offset === 0) { // Active card
        targetProps = {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          rotateZ: 0,
          autoAlpha: 1,
          // zIndex: items.length + 1, // Ensure active card is on top
        };
      } else { // Non-active cards (stacked behind or fanned out)
        targetProps = {
          xPercent: offset * 5, // Slight horizontal offset for stacking
          yPercent: Math.abs(offset) * 2, // Slight vertical offset
          scale: 1 - Math.abs(offset) * 0.05, // Scale down based on distance
          rotateZ: offset * 3, // Slight rotation
          autoAlpha: 1 - Math.abs(offset) * 0.2, // Fade out further cards (max 5 cards visible)
          // zIndex: items.length - Math.abs(offset),
        };
        if (Math.abs(offset) > 2) { // Hide cards that are too far in the stack
            targetProps.autoAlpha = 0;
        }
      }

      timelineRef.current.to(card, {
        ...targetProps,
        duration: 0.5,
        ease: 'power2.out',
      }, "<0.1"); // Overlap animations slightly
    });

  }, [activeIndex, items, cardsContainerRef, cardRefs, tagARef, tagBRef, projectNameARef, projectNameBRef, projectYearRef, isReady]);

  return {
    // The hook currently doesn't need to return anything as it directly animates.
    // If it controlled activeIndex via drag, it would return handlers.
  };
};

export default usePortfolioSliderAnimation;
