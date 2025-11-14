'use client';

import React, { useEffect, useRef } from 'react';

import { motion } from 'motion/react';

interface BgBubblesProps extends React.PropsWithChildren {
  interactive?: boolean;
  className?: string;
  colors?: string[];
  transition?: {
    stiffness: number;
    damping: number;
  };
}

/**
 * DEFAULT_COLORS: 20 colors across 6 color families (Blue, Pink, Purple, Green, Orange, Yellow)
 * Each family has 3-4 tonal variations for visual diversity
 */
const DEFAULT_COLORS = [
  // Blue/Cyan family
  '#08A4BD',
  '#00B4C8',
  '#0099B6',
  '#006BA3',
  // Pink/Magenta family
  '#D87CAC',
  '#FF6B9D',
  '#FF1493',
  '#E60B7A',
  // Purple/Indigo family
  '#B45096',
  '#9D4EDD',
  '#7B2CBF',
  '#5A189A',
  // Green/Teal family
  '#00FF88',
  '#00E5A0',
  '#32C8DC',
  '#1DB5B5',
  // Orange/Red family
  '#FF6B35',
  '#FF8C42',
  '#FF9800',
  '#FF5733',
  // Yellow/Gold family
  '#FFD60A',
  '#FFC300',
  '#FFED4E',
  '#FFC800',
];

/**
 * Converts HEX color format to RGB string format for CSS variable usage
 * @param hex - HEX color code (e.g., '#FF0000')
 * @returns RGB string format (e.g., '255,0,0')
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  const r = Number.parseInt(result[1], 16);
  const g = Number.parseInt(result[2], 16);
  const b = Number.parseInt(result[3], 16);
  return `${r},${g},${b}`;
}

export function BgBubblesComponent({
  interactive = true,
  className = '',
  children,
  colors = DEFAULT_COLORS,
  transition = { stiffness: 100, damping: 20 },
}: BgBubblesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);
  const bubblesPhysicsRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; angle: number }>
  >([]);
  const animationRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  const colorCount = colors.length;
  const rgbColors = colors.map((color) => hexToRgb(color));

  /**
   * Generate fixed grid positions that evenly distribute bubbles across the entire canvas
   * Creates a deterministic pattern ensuring complete viewport coverage with no dead zones
   * Uses percentage-based positioning for responsive scaling across all viewport sizes
   * Always generates exactly as many positions as there are colors
   */
  const bubbleInitialPositions = React.useMemo(() => {
    const positions: Array<{ x: number; y: number }> = [];
    const totalBubbles = colorCount;

    // Calculate grid dimensions based on bubble count
    const cols = Math.ceil(Math.sqrt(totalBubbles));
    const rows = Math.ceil(totalBubbles / cols);

    for (let i = 0; i < totalBubbles; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      // Calculate position with even distribution across canvas as percentages
      // Ranges from -50% to 50% of container dimensions
      const xOffsetPercent = (col / (cols - 1 || 1)) * 100 - 50;
      const yOffsetPercent = (row / (rows - 1 || 1)) * 100 - 50;

      // Jitter: small random variation (±3% of container) for organic feel
      const jitterXPercent = (Math.random() - 0.5) * 6;
      const jitterYPercent = (Math.random() - 0.5) * 6;

      positions.push({
        x: xOffsetPercent + jitterXPercent,
        y: yOffsetPercent + jitterYPercent,
      });
    }
    return positions;
  }, [colorCount]);

  /**
   * Initialize bubble physics state with grid starting positions
   * Each bubble gets a grid position, velocity, and angle for autonomous wandering
   */
  React.useLayoutEffect(() => {
    if (initializedRef.current) return;

    bubblesRef.current = Array.from({ length: colorCount });
    // Initialize physics state starting from the grid positions
    bubblesPhysicsRef.current = Array.from({ length: colorCount }, (_, i) => ({
      x: bubbleInitialPositions[i]?.x || 0,
      y: bubbleInitialPositions[i]?.y || 0,
      vx: 0,
      vy: 0,
      angle: Math.random() * Math.PI * 2,
    }));

    initializedRef.current = true;
  }, [bubbleInitialPositions]);

  /**
   * Track mouse position for interactive cursor attraction
   * Converts mouse coordinates to container-relative coordinates
   */
  useEffect(() => {
    if (!interactive) return;

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.current = e.clientX - centerX;
      mouseY.current = e.clientY - centerY;
    };

    currentContainer?.addEventListener('mousemove', handleMouseMove);
    return () =>
      currentContainer?.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  /**
   * Main animation loop using requestAnimationFrame
   * Updates bubble physics including:
   * - Autonomous wandering (continuous self-directed movement)
   * - Mouse attraction (spring physics pulling bubbles toward cursor)
   * - Damping (friction that slows down movement over time)
   * - Velocity clamping (prevents erratic fast movement)
   */
  useEffect(() => {
    if (bubblesRef.current.length === 0) return;

    const animate = () => {
      const stiffness = interactive ? transition.stiffness / 1000 : 0;
      const damping = transition.damping / 100;
      const wanderSpeed = 0.02; // Controls autonomous wandering speed

      // Update physics for each bubble
      for (let i = 0; i < bubblesPhysicsRef.current.length; i++) {
        const bubble = bubblesPhysicsRef.current[i];
        const bubbleEl = bubblesRef.current[i];

        // Autonomous wandering: bubbles move in random directions smoothly
        bubble.angle += (Math.random() - 0.5) * 0.1;
        const wanderForceX = Math.cos(bubble.angle) * wanderSpeed;
        const wanderForceY = Math.sin(bubble.angle) * wanderSpeed;
        bubble.vx += wanderForceX;
        bubble.vy += wanderForceY;

        // Interactive cursor attraction: bubbles move toward cursor within 300px radius
        if (interactive) {
          const dx = mouseX.current - bubble.x;
          const dy = mouseY.current - bubble.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 300) {
            bubble.vx += (dx / Math.max(distance, 1)) * stiffness;
            bubble.vy += (dy / Math.max(distance, 1)) * stiffness;
          }
        }

        // Apply damping (friction) to gradually slow down movement
        bubble.vx *= damping;
        bubble.vy *= damping;

        // Clamp maximum velocity to prevent erratic movement
        const speed = Math.hypot(bubble.vx, bubble.vy);
        if (speed > 5) {
          bubble.vx = (bubble.vx / speed) * 5;
          bubble.vy = (bubble.vy / speed) * 5;
        }

        // Update bubble position based on velocity
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Apply physics-based position to DOM element
        if (bubbleEl) {
          bubbleEl.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [interactive, transition]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <style>{`
        :root {
          ${rgbColors.map((color, i) => `--bubble-color-${i}: ${color};`).join('\n          ')}
        }

        @keyframes float {
          0%, 100% { transform: translateY(-50px); }
          50% { transform: translateY(50px); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes drift {
          0%, 100% { transform: translateX(-50px); }
          50% { transform: translateX(50px); }
        }

        .bubble-container {
          position: absolute;
          inset: 0;
          filter: url(#gooey) blur(40px);
          mix-blend-mode: screen;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          mix-blend-mode: hard-light;
        }

        ${rgbColors
          .map((_, i) => {
            const animationSpeed = 20 + (i % 3) * 10;
            let animationType = 'float';
            if (i % 3 === 1) animationType = 'rotate';
            else if (i % 3 === 2) animationType = 'drift';
            const opacity = i === rgbColors.length - 1 ? '0.7' : '1';

            // Larger bubble sizes for complete canvas coverage
            const baseSize = 100 + (i % 4) * 30; // Increased from 60-100 to 100-220

            return `
            .bubble-${i} {
              width: ${baseSize}%;
              height: ${baseSize}%;
              background: radial-gradient(
                circle at center,
                rgba(var(--bubble-color-${i}), 0.8) 0%,
                rgba(var(--bubble-color-${i}), 0) 50%
              );
              animation: ${animationType} ${animationSpeed}s ease-in-out infinite;
              opacity: ${opacity};
              filter: drop-shadow(0 0 20px rgba(var(--bubble-color-${i}), 0.4));
            }
          `;
          })
          .join('\n')}
      `}</style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        }}
      >
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="bubble-container">
        {colors.map((color, i) => {
          const initialPos = bubbleInitialPositions[i] || { x: 0, y: 0 };

          return (
            <motion.div
              key={color}
              ref={(el) => {
                if (el) bubblesRef.current[i] = el;
              }}
              className={`bubble bubble-${i}`}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
              style={{
                left: `${initialPos.x}%`,
                top: `${initialPos.y}%`,
                x: 0, // Physics engine will override this with transform
                y: 0, // Physics engine will override this with transform
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
