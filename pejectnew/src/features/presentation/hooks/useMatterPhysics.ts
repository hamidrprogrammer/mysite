import { useLayoutEffect, useRef } from 'react';
import Matter from 'matter-js';

interface UseMatterPhysicsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isSlideVisible: boolean;
  // Options for customization can be added here
}

const useMatterPhysics = ({ containerRef, isSlideVisible }: UseMatterPhysicsProps) => {
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !isSlideVisible) {
      // If slide is not visible, or container not ready, cleanup existing instance if any
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        Matter.World.clear(engineRef.current!.world, false); // false to keep composites
        Matter.Engine.clear(engineRef.current!);
        renderRef.current.canvas.remove();
        renderRef.current.textures = {}; // Clear textures
        renderRef.current = null;
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
        runnerRef.current = null;
      }
      engineRef.current = null;
      return;
    }

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Create engine
    engineRef.current = Matter.Engine.create();
    const world = engineRef.current.world;
    // engineRef.current.gravity.y = 0.5; // Adjust gravity

    // Create renderer
    renderRef.current = Matter.Render.create({
      element: container,
      engine: engineRef.current,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false, // Set to true for debugging wireframes
        background: 'transparent', // Or a specific color like '#060606'
      },
    });

    // Add some bodies (e.g., circles with image textures)
    const imageUrls = [
      '/pic/logo01.webp', '/pic/logo02.webp', '/pic/logo03.webp', '/pic/logo04.webp',
      '/pic/logo05.webp', '/pic/logo06.webp', '/pic/logo07.webp', '/pic/logo08.webp',
      // Add more relevant small images/icons if available
      // For example, if there are simple icons for "AI", "Strategy", "Research"
      // For now, using logos as placeholders
    ];

    const bodies = [];
    const numBodies = 15;
    const imageSizeCache: { [key: string]: { width: number, height: number } } = {};

    // Preload image dimensions (simplified, ideally use actual image loading)
    imageUrls.forEach(url => {
        // In a real scenario, you'd load the image to get its dimensions.
        // Here, we'll use estimated or fixed sizes if not available.
        // For logos used, their original widths were: 51.5, 77.5, 69.5, 124.5, 180.5, 143, 109.5, 111
        // We'll use a placeholder average size for scaling.
        const img = new Image();
        img.src = url;
        // This is async, so for immediate use it's tricky. Using fixed size for now.
        imageSizeCache[url] = { width: 100, height: 100 }; // Placeholder average size
    });


    for (let i = 0; i < numBodies; i++) {
      const radius = Matter.Common.random(25, 45); // Slightly larger bodies
      const randomTextureUrl = imageUrls[i % imageUrls.length]; // Cycle through images
      const textureOriginalSize = imageSizeCache[randomTextureUrl] || { width: 100, height: 100 };

      // Calculate xScale and yScale to fit the texture onto the circle area
      // This makes the texture fill the diameter of the circle
      const diameter = radius * 2;

      bodies.push(
        Matter.Bodies.circle(
          Matter.Common.random(radius, containerWidth - radius), // x position
          Matter.Common.random(-containerHeight * 0.5, -radius),    // y position (start above canvas)
          radius,
          {
            restitution: 0.6,
            friction: 0.02,
            angle: Math.random() * Math.PI * 2, // Random initial angle
            render: {
              sprite: {
                texture: randomTextureUrl,
                // Adjust xScale and yScale so the texture covers the circle appropriately
                // This assumes the texture is somewhat square or we want to fit it into a square area of diameter x diameter
                xScale: diameter / textureOriginalSize.width,
                yScale: diameter / textureOriginalSize.height,
              }
            }
          }
        )
      );
    }
    Matter.World.add(world, bodies);

    // Add static boundaries (walls and floor)
    const wallOptions = { isStatic: true, render: { visible: false } }; // Make walls invisible
    Matter.World.add(world, [
      Matter.Bodies.rectangle(containerWidth / 2, containerHeight + 25, containerWidth, 50, wallOptions), // Floor
      Matter.Bodies.rectangle(containerWidth + 25, containerHeight / 2, 50, containerHeight, wallOptions), // Right wall
      Matter.Bodies.rectangle(-25, containerHeight / 2, 50, containerHeight, wallOptions),           // Left wall
      // Matter.Bodies.rectangle(containerWidth / 2, -25, containerWidth, 50, wallOptions) // Ceiling (optional)
    ]);

    // Create runner
    runnerRef.current = Matter.Runner.create();
    Matter.Runner.run(runnerRef.current, engineRef.current);

    // Run the renderer
    Matter.Render.run(renderRef.current);

    // Handle resize
    const handleResize = () => {
        if (!renderRef.current || !containerRef.current || !engineRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        renderRef.current.bounds.max.x = newWidth;
        renderRef.current.bounds.max.y = newHeight;
        renderRef.current.options.width = newWidth;
        renderRef.current.options.height = newHeight;
        renderRef.current.canvas.width = newWidth;
        renderRef.current.canvas.height = newHeight;
        // Update wall positions (example for floor)
        Matter.Body.setPosition(world.bodies.find(body => body.label === 'Rectangle Body' && body.isStatic && body.position.y > containerHeight - 50)!, { x: newWidth / 2, y: newHeight + 25 });
        // Similar updates for other walls
    };
    window.addEventListener('resize', handleResize);


    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        // Matter.World.clear(engineRef.current!.world, false); // Keep false to not remove composites if any
        // Matter.Engine.clear(engineRef.current!);
        if (renderRef.current.canvas) {
            renderRef.current.canvas.remove();
        }
        renderRef.current.textures = {};
        renderRef.current = null;
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
        runnerRef.current = null;
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };
  }, [containerRef, isSlideVisible]); // Rerun if visibility changes or container changes
};

export default useMatterPhysics;
