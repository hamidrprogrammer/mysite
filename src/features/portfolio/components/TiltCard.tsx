import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/TiltCard.module.css';

interface Project {
  id: number;
  name: string;
  tag: string;
  year: string;
  image: string;
  link: string;
}

interface TiltCardProps {
  project: Project;
}

const TiltCard: React.FC<TiltCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -10;
      const rotateY = (x - centerX) / centerX * 10;

      gsap.to(cardRef.current, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.tiltCardContainer}>
      <div 
        ref={cardRef} 
        className={styles.tiltCard}
        style={{ backgroundImage: `url(${project.image})` }}
      >
        <a href={project.link} className={styles.cardLink}>
          <div className={styles.cardContent}>
            <h3>{project.name}</h3>
            <p>{project.tag} • {project.year}</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default TiltCard;