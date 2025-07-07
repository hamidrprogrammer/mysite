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

    // Add some bodies (e.g., circles)
    const bodies = [];
    for (let i = 0; i < 15; i++) { // Add a few circles
      bodies.push(
        Matter.Bodies.circle(
          Matter.Common.random(50, containerWidth - 50), // x position
          Matter.Common.random(-containerHeight, -50),    // y position (start above canvas)
          Matter.Common.random(10, 30), // radius
          {
            restitution: 0.7, // Bounciness
            friction: 0.01,
            render: {
              fillStyle: `hsl(${Matter.Common.random(0, 360)}, 70%, 60%)` // Random color
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
