import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UseHaloLogicProps {
  mountRef: React.RefObject<HTMLDivElement>; // Ref to the div where canvas will be mounted
  canvasRef?: React.RefObject<HTMLCanvasElement | null>; // Optional: if canvas is in JSX
}

const useHaloLogic = ({ mountRef }: UseHaloLogicProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null); // Placeholder for the halo object

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Scene, Camera, Renderer
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75, // FOV
      mountRef.current.clientWidth / mountRef.current.clientHeight, // Aspect Ratio
      0.1, // Near
      1000 // Far
    );
    cameraRef.current.position.z = 5; // Move camera back a bit

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha true for transparent background
    rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Placeholder Halo Object (e.g., a Torus or a custom geometry later)
    const geometry = new THREE.TorusGeometry(1.5, 0.2, 16, 100); // Example: radius, tube, radialSegments, tubularSegments
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd700, // Gold-ish color
        emissive: 0xaa8800, // Make it glow a bit
        metalness: 0.8,
        roughness: 0.3,
    });
    meshRef.current = new THREE.Mesh(geometry, material);
    sceneRef.current.add(meshRef.current);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    sceneRef.current.add(pointLight);


    // Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.005;
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (mountRef.current && rendererRef.current && cameraRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      // Dispose geometry and material if needed
      if(meshRef.current) {
        meshRef.current.geometry.dispose();
        if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach(m => m.dispose());
        } else {
            meshRef.current.material.dispose();
        }
      }
    };
  }, [mountRef]);

  // The hook doesn't need to return anything for this basic setup,
  // as it directly manipulates the DOM via mountRef.
};

export default useHaloLogic;
