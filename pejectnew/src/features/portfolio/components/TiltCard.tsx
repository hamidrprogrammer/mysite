import React, { useRef } from 'react';
import styles from '../styles/TiltCard.module.css';
import useTiltEffect from '../hooks/useTiltEffect'; // Import the hook

interface TiltCardProps {
  item: {
    id: string;
    title: string;
    subTitle?: string; // Added for completeness
    tags?: string[];    // Added for completeness
    imageUrl?: string; // Optional if background is handled by CSS or for fallback
    behanceUrl: string;
    year?: string;
  };
  isActive: boolean; // To apply different styles or behavior for the active card
  zIndex: number; // For stacking effect
  // style prop will be passed by PortfolioSlider for GSAP animations
  style?: React.CSSProperties;
}

const TiltCard: React.FC<TiltCardProps> = ({ item, isActive, zIndex, style }) => {
  const tiltCardContainerRef = useRef<HTMLDivElement>(null); // Ref for the container that will tilt

  useTiltEffect(tiltCardContainerRef, isActive, { maxTilt: 8, scale: 1.03 }); // Apply tilt effect

  return (
    <div
      ref={tiltCardContainerRef}
      className={`${styles.tiltCardContainer} tilt-card-container`}
      style={{ ...style, zIndex }}
    >
      <div
        className={styles.tiltCard} // This inner div is for background image and content that does NOT tilt
        style={{ backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined }}
      >
        <a
          href={item.behanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardLink}
          aria-label={`View project ${item.title} on Behance`}
        >
          {/* Content that should not tilt with the card can go here if any */}
        </a>
      </div>
    </div>
  );
};

export default TiltCard;
