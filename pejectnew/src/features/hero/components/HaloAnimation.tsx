import React, { useRef, useEffect } from 'react';
import useHaloLogic from '../hooks/useHaloLogic'; // To be created
import styles from '../styles/HaloAnimation.module.css'; // To be created

const HaloAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null); // Ref for the div where the canvas will be appended
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for the canvas itself, if needed by the hook

  // The useHaloLogic hook will handle the Three.js setup and animation loop.
  // It will likely append the renderer's DOM element (canvas) to mountRef.
  useHaloLogic({ mountRef, canvasRef });

  return (
    <div ref={mountRef} className={styles.haloCanvasContainer}>
      {/* The Three.js canvas will be injected here by the useHaloLogic hook */}
      {/* Optionally, if the hook creates and returns a canvas, we can use canvasRef here: */}
      {/* <canvas ref={canvasRef} className={styles.haloCanvas} /> */}
    </div>
  );
};

export default HaloAnimation;
