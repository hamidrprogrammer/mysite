import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UsePresentationScrollAnimationProps {
  sectionRef: React.RefObject<HTMLElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  slidesRefs: React.RefObject<(HTMLDivElement | null)[]>;
  isReady: boolean;
}

const usePresentationScrollAnimation = ({
  sectionRef,
  wrapperRef,
  slidesRefs,
  isReady,
}: UsePresentationScrollAnimationProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlideIndexRef = useRef(0);

  useLayoutEffect(() => {
    if (!isReady || !sectionRef.current || !wrapperRef.current) return;

    const slides = slidesRefs.current?.filter((el): el is HTMLDivElement => el !== null) || [];
    if (slides.length === 0) return;

    const slideContents = slides.map(s => s.firstChild as HTMLElement).filter(el => el);
    if (slideContents.length !== slides.length) {
      console.warn('Presentation slides might not have direct children to animate.');
      return;
    }

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const scrollDistancePerSlideTransition = window.innerHeight;
    gsap.set(wrapper, { height: `${slides.length * scrollDistancePerSlideTransition}px` });

    const STACK_ROTATE_X = -40; // Degrees
    const ACTIVE_ROTATE_X = 0;
    const ACTIVE_SCALE = 1;
    const ACTIVE_Y_PX = 0;
    const ACTIVE_Z_INDEX = slides.length + 5;

    // Initial setup for all slides
    slideContents.forEach((slideContent, idx) => {
        gsap.set(slideContent, {
            position: 'absolute', top: 0, left: '50%', xPercent: -50,
            width: '89.79%', height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'center top',
        });

        if (idx === 0) { // First slide is active
            gsap.set(slideContent, {
                autoAlpha: 1,
                y: ACTIVE_Y_PX,
                rotateX: ACTIVE_ROTATE_X,
                scale: ACTIVE_SCALE,
                zIndex: ACTIVE_Z_INDEX
            });
        } else { // Other slides are stacked
            gsap.set(slideContent, {
                autoAlpha: 1, // Visible in the stack
                y: `${6 + idx * 10}px`, // Progressively lower, adjust 10px for stacking depth
                rotateX: STACK_ROTATE_X,
                scale: Math.max(0.7, 1 - (idx * 0.05)), // Progressively smaller
                zIndex: slides.length - idx,
            });
        }
    });

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: section,
        scrub: 1.2,
        start: 'top top',
        end: () => `+=${(slides.length - 1) * scrollDistancePerSlideTransition}`,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const progressPerSlide = slides.length > 1 ? 1 / (slides.length - 1) : 1;
          let newSlideIdx = Math.round(self.progress / progressPerSlide);
          newSlideIdx = Math.min(newSlideIdx, slides.length - 1);

          if (newSlideIdx !== currentSlideIndexRef.current) {
            setCurrentSlideIndex(newSlideIdx);
            currentSlideIndexRef.current = newSlideIdx;
          }
        },
      },
    });

    // Create animations for each transition
    for (let i = 0; i < slides.length - 1; i++) {
      const currentActiveSlide = slideContents[i];
      const nextActiveSlide = slideContents[i + 1];

      const transitionDuration = 0.5; // Duration for each step
      // Define the point in the master timeline where this transition happens
      // Each slide's animation should start when the previous one is about to finish its "active" phase.
      const animationStartTime = (i / (slides.length - 1)) * masterTimeline.scrollTrigger!.end ;


      // 1. Animate currentActiveSlide (i) moving to the first stack position
      masterTimeline.to(currentActiveSlide, {
        y: `${6 + 1 * 10}px`, // Position of the first item in stack (depth 1)
        rotateX: STACK_ROTATE_X,
        scale: Math.max(0.7, 1 - (1 * 0.05)), // Scale of the first item in stack
        zIndex: slides.length - 1, // zIndex for first item in stack
        autoAlpha: 1, // Keep it visible
        ease: 'power2.inOut',
        duration: transitionDuration,
      }, animationStartTime);

      // 2. Animate nextActiveSlide (i+1) moving from its current stack position to active
      masterTimeline.to(nextActiveSlide, {
        y: ACTIVE_Y_PX,
        rotateX: ACTIVE_ROTATE_X,
        scale: ACTIVE_SCALE,
        zIndex: ACTIVE_Z_INDEX,
        autoAlpha: 1,
        ease: 'power2.inOut',
        duration: transitionDuration,
      }, animationStartTime); // Start at the same time

      // 3. Adjust other slides in the stack
      // Slides further back (k < i) need to be pushed further back or hidden
      for(let k = 0; k < i; k++) {
          const farSlide = slideContents[k];
          const depthFromNewActive = (i + 1) - k; // Depth relative to the new active slide (i+1)
          masterTimeline.to(farSlide, {
              y: `${6 + depthFromNewActive * 10}px`,
              rotateX: STACK_ROTATE_X,
              scale: Math.max(0.7, 1 - (depthFromNewActive * 0.05)),
              zIndex: slides.length - depthFromNewActive,
              autoAlpha: depthFromNewActive < 3 ? 1 : 0, // Show 2 slides behind active, hide others
              duration: transitionDuration,
              ease: 'power2.inOut'
          }, animationStartTime);
      }
      // Slides further ahead (k > i+1) in the initial stack also need to adjust to their new relative position
      // This part is tricky as their "from" state is their current GSAP-interpolated state.
      // For simplicity, the initial .set() establishes their "target" stacked state relative to slide 0.
      // The timeline tweens then move them relative to the *new* active slide.
      // The current animation logic primarily focuses on the transition between slide i and i+1.
      // A more robust stacking logic might re-evaluate all non-active slides' positions at each step.
      // For now, we ensure the direct previous and current are handled, and far-back ones are hidden.
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      masterTimeline.kill();
      slideContents.forEach(slide => gsap.set(slide, { clearProps: 'all' }));
      gsap.set(wrapper, { clearProps: 'height' });
    };
  }, [isReady, sectionRef, wrapperRef, slidesRefs]); // Removed setCurrentSlideIndex from deps

  return { currentSlideIndex };
};

export default usePresentationScrollAnimation;
