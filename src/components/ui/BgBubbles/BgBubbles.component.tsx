'use client';

import React, { useEffect, useRef } from 'react';

interface BgBubblesProps extends React.PropsWithChildren {
  interactive?: boolean;
  className?: string;
  colors?: string[];
  transition?: {
    stiffness: number;
    damping: number;
  };
}

// 20 colori con tonalità diverse (6 tonalità principali x variazioni)
const DEFAULT_COLORS = [
  // Blu/Ciano
  '#08A4BD',
  '#00B4C8',
  '#0099B6',
  '#006BA3',
  // Rosa/Magenta
  '#D87CAC',
  '#FF6B9D',
  '#FF1493',
  '#E60B7A',
  // Viola/Indaco
  '#B45096',
  '#9D4EDD',
  '#7B2CBF',
  '#5A189A',
  // Verde/Teal
  '#00FF88',
  '#00E5A0',
  '#32C8DC',
  '#1DB5B5',
  // Arancione/Rosso
  '#FF6B35',
  '#FF8C42',
  '#FF9800',
  '#FF5733',
  // Giallo/Oro
  '#FFD60A',
  '#FFC300',
  '#FFED4E',
  '#FFC800',
];

// Convert HEX to RGB
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

  const colorCount = colors.length;
  const rgbColors = colors.map((color) => hexToRgb(color));

  // Initialize bubblesRef array size and physics state with random positions and angles
  React.useLayoutEffect(() => {
    bubblesRef.current = Array.from({ length: colorCount });
    bubblesPhysicsRef.current = Array.from({ length: colorCount }, () => ({
      x: (Math.random() - 0.5) * 400, // Random position from -200 to 200
      y: (Math.random() - 0.5) * 400, // Random position from -200 to 200
      vx: 0,
      vy: 0,
      angle: Math.random() * Math.PI * 2,
    }));
  }, [colorCount]);

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

  useEffect(() => {
    if (bubblesRef.current.length === 0) return;

    const animate = () => {
      const stiffness = interactive ? transition.stiffness / 1000 : 0;
      const damping = transition.damping / 100;
      const wanderSpeed = 0.02;

      // Update physics for each bubble
      for (let i = 0; i < bubblesPhysicsRef.current.length; i++) {
        const bubble = bubblesPhysicsRef.current[i];
        const bubbleEl = bubblesRef.current[i];

        // Add autonomous wandering movement
        bubble.angle += (Math.random() - 0.5) * 0.1;
        const wanderForceX = Math.cos(bubble.angle) * wanderSpeed;
        const wanderForceY = Math.sin(bubble.angle) * wanderSpeed;
        bubble.vx += wanderForceX;
        bubble.vy += wanderForceY;

        // Apply spring force towards mouse only if interactive
        if (interactive) {
          const dx = mouseX.current - bubble.x;
          const dy = mouseY.current - bubble.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 300) {
            bubble.vx += (dx / Math.max(distance, 1)) * stiffness;
            bubble.vy += (dy / Math.max(distance, 1)) * stiffness;
          }
        }

        // Apply damping
        bubble.vx *= damping;
        bubble.vy *= damping;

        // Limit max speed
        const speed = Math.hypot(bubble.vx, bubble.vy);
        if (speed > 5) {
          bubble.vx = (bubble.vx / speed) * 5;
          bubble.vy = (bubble.vy / speed) * 5;
        }

        // Update position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Update DOM with transform that combines animation and position
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

            return `
            .bubble-${i} {
              top: ${10 + (i % 4) * 15}%;
              left: ${10 + (i % 5) * 12}%;
              width: ${60 + (i % 4) * 10}%;
              height: ${60 + (i % 4) * 10}%;
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
        {colors.map((color, i) => (
          <div
            key={color}
            ref={(el) => {
              if (el) bubblesRef.current[i] = el;
            }}
            className={`bubble bubble-${i}`}
          />
        ))}
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
