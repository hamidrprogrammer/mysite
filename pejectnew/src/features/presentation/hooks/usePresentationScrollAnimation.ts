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
  const currentSlideIndexRef = useRef(0); // **اینجا در سطح بالا**

  useLayoutEffect(() => {
    if (!isReady || !sectionRef.current || !wrapperRef.current) return;

    const slides = slidesRefs.current?.filter((el): el is HTMLDivElement => el !== null) || [];
    if (slides.length === 0) return;

    const slideContents = slides
      .map(s => s.firstChild as HTMLElement)
      .filter(el => el);

    if (slideContents.length !== slides.length) {
      console.warn('Slide content structure might be unexpected.');
      return;
    }

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const DURATION_PER_SLIDE_SCROLL = section.offsetHeight;

    gsap.set(wrapper, { height: `${slides.length * DURATION_PER_SLIDE_SCROLL}px` });

    slideContents.forEach((slideContent, index) => {
      gsap.set(slideContent, {
        position: 'absolute',
        top: 0,
        left: '50%',
        xPercent: -50,
        width: '100%',
        height: '100%',
        zIndex: 1,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center top',
        autoAlpha: 0,
      });

      if (index === 0) {
        gsap.set(slideContent, { autoAlpha: 1, yPercent: 0, rotateX: 0, scale: 1, zIndex: 2 });
      } else {
        gsap.set(slideContent, { yPercent: 80, rotateX: 30, scale: 0.9, autoAlpha: 0 });
      }
    });

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: section,
        scrub: 1.0,
        start: 'top top',
        end: () => `+=${(slides.length - 1) * DURATION_PER_SLIDE_SCROLL}`,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const progressPerSlide = 1 / (slides.length - 1);
          let newIndex = Math.floor(self.progress / progressPerSlide);
          newIndex = Math.min(newIndex, slides.length - 1);
          if (self.progress === 1) newIndex = slides.length - 1;

          if (newIndex !== currentSlideIndexRef.current) {
            setCurrentSlideIndex(newIndex);
            currentSlideIndexRef.current = newIndex;
          }
        },
      },
    });

    slideContents.forEach((slideContent, index) => {
      if (index === 0) return;

      const prevSlideContent = slideContents[index - 1];

      masterTimeline
        .addLabel(`start-slide-${index}`, `>${DURATION_PER_SLIDE_SCROLL * (index - 1) / section.offsetHeight * 0.1}`)
        .to(
          prevSlideContent,
          {
            yPercent: -60,
            rotateX: -30,
            scale: 0.85,
            autoAlpha: 0,
            ease: 'power2.in',
            zIndex: 1,
            duration: 0.6,
            transformOrigin: 'center bottom',
          },
          `start-slide-${index}`
        )
        .to(
          slideContent,
          {
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            autoAlpha: 1,
            zIndex: 2,
            ease: 'power2.out',
            duration: 0.7,
            transformOrigin: 'center top',
          },
          `start-slide-${index}+=0.1`
        );
    });

    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      slideContents.forEach(slide => gsap.set(slide, { clearProps: 'all' }));
      gsap.set(wrapper, { clearProps: 'height' });
    };
  }, [sectionRef, wrapperRef, slidesRefs, isReady]); // setCurrentSlideIndex را حذف کردم از دپندنسی‌ها

  return { currentSlideIndex };
};

export default usePresentationScrollAnimation;
