import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import TiltCard from './TiltCard';
import styles from '../styles/PortfolioSlider.module.css';

interface Project {
  id: number;
  name: string;
  tag: string;
  year: string;
  image: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: 'Brand Identity',
    tag: 'Creative',
    year: '2023',
    image: '/pic/project1.jpg',
    link: '#'
  },
  {
    id: 2,
    name: 'Web Design',
    tag: 'Digital',
    year: '2023',
    image: '/pic/project2.jpg',
    link: '#'
  },
  {
    id: 3,
    name: 'Mobile App',
    tag: 'Product',
    year: '2024',
    image: '/pic/project3.jpg',
    link: '#'
  }
];

const PortfolioSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const tagARef = useRef<HTMLHeadingElement>(null);
  const tagBRef = useRef<HTMLHeadingElement>(null);
  const nameARef = useRef<HTMLHeadingElement>(null);
  const nameBRef = useRef<HTMLHeadingElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  const currentProject = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: mousePos.x,
        y: mousePos.y,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(cursorRef.current, {
        opacity: isHovering ? 1 : 0,
        duration: 0.3
      });
    }
  }, [mousePos, isHovering]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    animateTextChange();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    animateTextChange();
  };

  const animateTextChange = () => {
    const tl = gsap.timeline();
    
    // Animate out current text
    tl.to([tagARef.current, nameARef.current, yearRef.current], {
      yPercent: -100,
      duration: 0.3,
      ease: 'power2.in'
    });

    // Animate in new text
    tl.fromTo([tagBRef.current, nameBRef.current], {
      yPercent: 100
    }, {
      yPercent: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Swap references
    setTimeout(() => {
      const tempTag = tagARef.current;
      const tempName = nameARef.current;
      tagARef.current = tagBRef.current;
      tagBRef.current = tempTag;
      nameARef.current = nameBRef.current;
      nameBRef.current = tempName;
    }, 300);
  };

  return (
    <div 
      ref={sliderRef}
      className={styles.portfolioSliderContainer}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Work Tag */}
      <div className={styles.portfolioWorkTag}>
        <div className={styles.projectTagHeading}>
          <h1 ref={tagARef} className={styles.projectTagA}>{currentProject.tag}</h1>
          <h1 ref={tagBRef} className={styles.projectTagB}>{nextProject.tag}</h1>
        </div>
      </div>

      {/* Center Cards */}
      <div className={styles.portfolioSliderCenter}>
        <TiltCard project={currentProject} />
      </div>

      {/* Project Name */}
      <div className={styles.portfolioProjectName}>
        <div className={styles.projectNameHeading}>
          <h1 ref={nameARef} className={styles.projectNameA}>{currentProject.name}</h1>
          <h1 ref={nameBRef} className={styles.projectNameB}>{nextProject.name}</h1>
          <span ref={yearRef} className={styles.projectYear}>{currentProject.year}</span>
        </div>
      </div>

      {/* Counter */}
      <div className={styles.portfolioCounter}>
        {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
      </div>

      {/* Custom Cursor */}
      <div ref={cursorRef} className={styles.portfolioCursor}>
        SHOW
      </div>

      {/* Dev Navigation */}
      <div className={styles.devNav}>
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default PortfolioSlider;