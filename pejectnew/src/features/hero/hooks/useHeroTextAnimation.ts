import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import styles from '../styles/HeroSection.module.css';

interface UseHeroTextAnimationProps {
  headingRef: React.RefObject<HTMLHeadingElement>;
  maskPart1Ref: React.RefObject<HTMLDivElement>;
  maskPart2Ref: React.RefObject<HTMLDivElement>;
  isPreloaderComplete: boolean;
}

const useHeroTextAnimation = ({
  headingRef,
  maskPart1Ref,
  maskPart2Ref,
  isPreloaderComplete,
}: UseHeroTextAnimationProps) => {
  useLayoutEffect(() => {
    if (
      !isPreloaderComplete ||
      !headingRef.current ||
      !maskPart1Ref.current ||
      !maskPart2Ref.current
    ) {
      return;
    }

    const headingElement = headingRef.current;

    // فیلتر کردن المنت‌ها که حداقل متن دارند
    const animatedTextElements = Array.from(
      headingElement.querySelectorAll<HTMLElement>(
        `.${styles.headingLink}, .${styles.notHoverable}`
      )
    ).filter(el => el?.textContent?.trim().length);

    const splitInstances: SplitType[] = [];

    animatedTextElements.forEach(el => {
      const split = new SplitType(el, { types: 'lines, words', lineClass: styles.splitLine });
      splitInstances.push(split);

      if (split.lines && split.lines.length > 0) {
        const validLines = split.lines.filter(line => !!line);
        gsap.set(validLines, { autoAlpha: 0, yPercent: 100, rotateX: -90 });
      }
    });

    gsap.set([maskPart1Ref.current, maskPart2Ref.current], { scaleY: 1 });

    const masterTimeline = gsap.timeline({
      onComplete: () => {
        splitInstances.forEach(s => s.revert());
      },
    });

    masterTimeline.to([maskPart1Ref.current, maskPart2Ref.current], {
      scaleY: 0,
      duration: 1,
      ease: 'power3.inOut',
      stagger: 0.1,
    });

    splitInstances.forEach(split => {
      if (split.lines && split.lines.length > 0) {
        const validLines = split.lines.filter(line => !!line);
        masterTimeline.to(
          validLines,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
          },
          '-=0.7'
        );
      }
    });

    return () => {
      masterTimeline.kill();
      splitInstances.forEach(s => s.revert());

      if (maskPart1Ref.current && maskPart2Ref.current) {
        const splitLines = animatedTextElements.flatMap(el =>
          Array.from(el.querySelectorAll<HTMLElement>(`.${styles.splitLine}`))
        );

        gsap.set([maskPart1Ref.current, maskPart2Ref.current, ...splitLines], {
          clearProps: 'all',
        });
      }
    };
  }, [isPreloaderComplete, headingRef, maskPart1Ref, maskPart2Ref]);
};

export default useHeroTextAnimation;
