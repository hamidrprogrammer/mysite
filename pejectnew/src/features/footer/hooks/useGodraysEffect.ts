import { useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

interface UseGodraysEffectProps {
  containerRef: React.RefObject<HTMLDivElement>; // Ref to the div where canvas will be mounted
  isActive?: boolean; // To control if the effect should be running (e.g. based on visibility)
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse; // Keep for potential future use or if original shader used it subtly

  varying vec2 vUv; // Normalized coordinates (0-1)

  // Function from original shader (adapted for THREE.js varying vUv)
  float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 fragCoord, float seedA, float seedB, float speed) {
      // fragCoord here is expected to be in pixel coords, vUv is 0-1. Convert vUv.
      vec2 coord = fragCoord; // If passing gl_FragCoord
      // If using vUv, then coord = vUv * iResolution;

      vec2 sourceToCoord = coord - raySource;
      float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);

      // Original values, might need tweaking based on visual output
      return clamp(
          (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
          (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
          0.0, 1.0) *
          clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      // Set the parameters of the sun rays (values from original)
      vec2 rayPos1 = vec2(iResolution.x * 0.5, iResolution.y * 0.3); // Center-ish top
      vec2 rayRefDir1 = normalize(vec2(1.0, -0.116)); // Direction of rays
      float raySeedA1 = 46.2;
      float raySeedB1 = 21.2;
      float raySpeed1 = 1.4;

      vec2 rayPos2 = vec2(iResolution.x * 0.5, iResolution.y * 0.3);
      vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
      float raySeedA2 = 22.2; // Original was const, but uniforms are fine
      float raySeedB2 = 18.0; // Original was const
      float raySpeed2 = 0.6;

      vec4 rays1 = vec4(1.0, 1.0, 0.918, 1.0) * rayStrength(rayPos1, rayRefDir1, fragCoord, raySeedA1, raySeedB1, raySpeed1);
      vec4 rays2 = vec4(1.0, 1.0, 0.918, 1.0) * rayStrength(rayPos2, rayRefDir2, fragCoord, raySeedA2, raySeedB2, raySpeed2);

      fragColor = rays1 * 0.3 + rays2 * 0.2;

      float brightness = 0.9 - (fragCoord.y / iResolution.y); // fragCoord.y is bottom-up in shader
      fragColor.rgb *= (0.1 + brightness); // Modulate brightness
      // fragColor.rgb *= vec3(0.8, 0.9, 1.0); // Blue-green tinge (optional)
  }

  void main() {
    // In Three.js, gl_FragCoord gives pixel coordinates.
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;


const useGodraysEffect = ({ containerRef, isActive = true }: UseGodraysEffectProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !isActive) {
        // Cleanup if not active or container is gone
        if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        if (rendererRef.current) {
            // Dispose of renderer and remove canvas
            rendererRef.current.dispose();
            if (rendererRef.current.domElement.parentElement) {
                rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current = null;
        }
        if (materialRef.current) materialRef.current.dispose();
        // Scene and camera don't have dispose methods in the same way
        return;
    }

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    sceneRef.current = new THREE.Scene();

    // Camera (Orthographic for full-screen shader effect)
    cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Material
    materialRef.current = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) },
        iMouse: { value: new THREE.Vector2(0,0) }, // Initialize mouse, can be updated
      },
      transparent: true, // If effect needs to blend with content behind
    });

    // Plane Mesh
    const planeGeometry = new THREE.PlaneGeometry(2, 2); // Covers the entire viewport in ortho cam
    const planeMesh = new THREE.Mesh(planeGeometry, materialRef.current);
    sceneRef.current.add(planeMesh);

    // Renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    rendererRef.current.setSize(width, height);
    container.appendChild(rendererRef.current.domElement);

    const startTime = Date.now();

    // Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (materialRef.current) {
        materialRef.current.uniforms.iTime.value = (Date.now() - startTime) / 1000.0;
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (containerRef.current && rendererRef.current && materialRef.current && cameraRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        rendererRef.current.setSize(newWidth, newHeight);
        materialRef.current.uniforms.iResolution.value.set(newWidth, newHeight);
        // Orthographic camera doesn't need aspect update like perspective
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement.parentElement) {
         rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      materialRef.current?.dispose();
      planeGeometry.dispose();
    };
  }, [containerRef, isActive]); // Rerun effect if container or isActive changes
};

export default useGodraysEffect;
