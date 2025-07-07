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

    // Mask parts should have transform-origin: bottom center (or top center) set via CSS.
    // Let's assume they start at scaleY = 0 (hidden, text visible or pre-animation state)
    // then scaleY = 1 (text covered), then scaleY = 0 (text revealed)
    // The current styles.heroMaskPart might need transform-origin.
    // The original inline HTML for hero-mask-part had style="transform: scale(1, 0);" initially.
    // This means they were already "open" or "revealed".
    // The animation in the original was likely:
    // 1. Text is visible.
    // 2. Masks quickly scaleY to 1 (covering text), then immediately scaleY to 0 (revealing animated text).
    // This creates a "wipe" effect.

    // Set initial states: text is ready to be animated in (hidden), masks are "open" (scaleY=0)
    // This is slightly different from the hook's current gsap.set(masks, {scaleY:1})
    gsap.set([maskPart1Ref.current, maskPart2Ref.current], { scaleY: 0, transformOrigin: 'bottom center' });


    const masterTimeline = gsap.timeline({
      onComplete: () => {
        splitInstances.forEach(s => s.revert()); // Clean up SplitType
      },
    });

    // Step 1: Masks quickly cover the area where text will appear
    masterTimeline.to([maskPart1Ref.current, maskPart2Ref.current], {
      scaleY: 1,
      duration: 0.5, // Quicker covering animation
      ease: 'power2.inOut',
      stagger: 0.05, // Small stagger for covering
    });

    // Step 2: Masks reveal the text (animating from hidden state to visible)
    // Add a label to sync animations
    masterTimeline.addLabel('reveal', '-=0.2'); // Start reveal slightly before cover finishes or adjust as needed

    masterTimeline.to([maskPart1Ref.current, maskPart2Ref.current], {
      scaleY: 0,
      duration: 1, // Slower revealing animation
      ease: 'power3.inOut',
      stagger: 0.1, // Stagger for revealing
      // transformOrigin: 'top center' // If they should open from top after covering from bottom
    }, 'reveal');

    splitInstances.forEach(split => {
      if (split.lines && split.lines.length > 0) {
        const validLines = split.lines.filter(line => !!line);
        // Text animation starts slightly after masks start revealing
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
          'reveal+=0.2' // Start text animation 0.2s after masks begin to reveal
        );
      }
    });

    return () => {
      masterTimeline.kill();
      splitInstances.forEach(s => s.revert());
      // Clear GSAP properties
      if (maskPart1Ref.current && maskPart2Ref.current) {
        gsap.set([maskPart1Ref.current, maskPart2Ref.current], { clearProps: 'all' });
      }
      animatedTextElements.forEach(el => {
        const lines = el.querySelectorAll<HTMLElement>(`.${styles.splitLine}`);
        if (lines.length > 0) {
          gsap.set(lines, { clearProps: 'all' });
        }
      });
    };
  }, [isPreloaderComplete, headingRef, maskPart1Ref, maskPart2Ref, styles.headingLink, styles.notHoverable, styles.splitLine]);
};

export default useHeroTextAnimation;
