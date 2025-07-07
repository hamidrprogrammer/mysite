// pejectnew/src/features/hero/hooks/useHaloLogic.ts

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UseHaloLogicProps {
  mountRef: React.RefObject<HTMLDivElement>; // Ref to the div where canvas will be mounted
  canvasRef?: React.RefObject<HTMLCanvasElement | null>; // Optional: if canvas is in JSX
}

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0); // position is in Normalized Device Coordinates for PlaneBufferGeometry(2,2)
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  uniform float iTime;

  // Constants from original shader, might need to be uniforms if they change or for GLSL ES 1.0 strictness
  const float raySeedA1 = 46.2;
  const float raySeedB1 = 21.2;
  const float raySpeed1 = 1.4;
  const float raySeedA2 = 22.2;
  const float raySeedB2 = 18.0;
  const float raySpeed2 = 0.6;

  float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);

    // Original clamp might be too aggressive for small canvases, adjust denominator if needed
    // float distanceFactor = clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
    // Let's use a simpler falloff or ensure raySource and coord are scaled well.
    // For now, let's assume the original logic works if iResolution is small.
    float distanceFactor = clamp(1.0 - length(sourceToCoord) / (max(iResolution.x, iResolution.y) * 0.8), 0.0, 1.0);


    return clamp(
        (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
        0.0, 1.0) * distanceFactor;
  }

  void main() {
    // gl_FragCoord is in pixel coordinates, origin at bottom-left.
    // iResolution is the size of the canvas in pixels.
    vec2 coord = gl_FragCoord.xy;

    vec2 rayPos1 = vec2(iResolution.x * 0.5, iResolution.y * 0.3);
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));

    vec2 rayPos2 = vec2(iResolution.x * 0.5, iResolution.y * 0.3);
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));

    vec4 rays1Color = vec4(1.0, 1.0, 0.918, 1.0); // Light gold
    vec4 rays2Color = vec4(1.0, 1.0, 0.918, 1.0);

    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    vec4 color = rays1Color * strength1 * 0.3 + rays2Color * strength2 * 0.2;

    // Brightness attenuation towards the bottom (original logic)
    float brightness = 0.9 - (coord.y / iResolution.y); // coord.y is from bottom
    color.rgb *= (0.1 + brightness * 1.0);

    gl_FragColor = color;
  }
`;


const useHaloLogic = ({ mountRef }: UseHaloLogicProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const uniformsRef = useRef({
    iTime: { value: 0.0 },
    iMouse: { value: new THREE.Vector2(0.0, 0.0) }, // Center of the screen (normalized)
    iResolution: { value: new THREE.Vector2(100, 100) }, // Placeholder, updated on resize
  });

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') {
        console.log("Mount ref not available or window undefined");
        return;
    }

    const currentMount = mountRef.current;
    console.log("HaloLogic: Mount acquired", currentMount);

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

    try {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      console.error("Error creating WebGLRenderer:", error);
      return;
    }

    rendererRef.current.setPixelRatio(window.devicePixelRatio);

    const updateSize = () => {
        if (currentMount && rendererRef.current && cameraRef.current) {
            let width = currentMount.clientWidth;
            let height = currentMount.clientHeight;

            if (width === 0 || height === 0) { // Fallback if clientWidth/Height is 0
                const rect = currentMount.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
            }

            if (width === 0 || height === 0) { // Still 0, maybe it's not in DOM correctly yet
                console.warn("HaloLogic: mountRef has zero dimensions. Using fallback.", width, height);
                width = width || 88; // Approx 5.5rem at 16px/rem
                height = height || 44; // Approx 2.75rem
            }

            rendererRef.current.setSize(width, height);
            uniformsRef.current.iResolution.value.set(width, height);
            // Orthographic camera does not need aspect update like PerspectiveCamera for this use case
        }
    };

    currentMount.appendChild(rendererRef.current.domElement);
    updateSize(); // Set initial size
    console.log("HaloLogic: Renderer appended, initial size:", uniformsRef.current.iResolution.value);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    meshRef.current = new THREE.Mesh(geometry, material);
    sceneRef.current.add(meshRef.current);

    // Mouse move listener
    const handleMouseMove = (event: MouseEvent) => {
        if (rendererRef.current) { // Check if renderer is available
            const rect = rendererRef.current.domElement.getBoundingClientRect();
            uniformsRef.current.iMouse.value.x = (event.clientX - rect.left) / rect.width; // Normalize to 0-1
            uniformsRef.current.iMouse.value.y = 1.0 - (event.clientY - rect.top) / rect.height; // Normalize and flip Y
        }
    };
    window.addEventListener('mousemove', handleMouseMove);


    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      uniformsRef.current.iTime.value = clockRef.current.getElapsedTime();

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    window.addEventListener('resize', updateSize);

    return () => {
      console.log("HaloLogic: Cleaning up");
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);

      meshRef.current?.geometry?.dispose();
      const mat = meshRef.current?.material as THREE.ShaderMaterial | THREE.Material[];
      if (Array.isArray(mat)) {
        mat.forEach(m => m.dispose());
      } else {
        mat?.dispose();
      }

      if (rendererRef.current?.domElement && currentMount.contains(rendererRef.current.domElement) ) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [mountRef]); // Only re-run if mountRef changes.
};

export default useHaloLogic;
