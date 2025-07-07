import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GreetingsSlide from './slides/GreetingsSlide';
import AboutSlide from './slides/AboutSlide';
import PhysicsSlide from './slides/PhysicsSlide';
import EstimatesSlide from './slides/EstimatesSlide';
import LastSlide from './slides/LastSlide';
import styles from '../styles/PresentationSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const PresentationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current || !slidesRef.current) return;

    const slides = slidesRef.current.querySelectorAll(`.${styles.slideWrapper}`);
    
    // Pin the section
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${wrapperRef.current!.offsetHeight - window.innerHeight}`,
      pin: true,
      pinSpacing: false,
    });

    // Animate slides
    slides.forEach((slide, index) => {
      if (index === 0) return; // Skip first slide

      gsap.set(slide, {
        y: '100vh',
        rotationX: 40,
        scale: 1.1,
        opacity: 0,
        visibility: 'hidden'
      });

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: `${index * 20}% top`,
        end: `${(index + 1) * 20}% top`,
        scrub: 1,
        animation: gsap.timeline()
          .set(slide, { visibility: 'visible' })
          .to(slide, {
            y: 0,
            rotationX: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          })
          .to(slide, {
            y: '-100vh',
            rotationX: -40,
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: 'power2.in'
          }, 1)
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.presentationSection}>
      <div ref={wrapperRef} className={styles.presentationWrapper}>
        <div ref={slidesRef} className={styles.slidesLayout}>
          <div className={styles.slideWrapper}>
            <GreetingsSlide />
          </div>
          <div className={styles.slideWrapper}>
            <AboutSlide />
          </div>
          <div className={styles.slideWrapper}>
            <PhysicsSlide />
          </div>
          <div className={styles.slideWrapper}>
            <EstimatesSlide />
          </div>
          <div className={styles.slideWrapper}>
            <LastSlide />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;