'use client';

import React from 'react';

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
 */
const DEFAULT_COLORS = [
  // Blue/Cyan
  '#08A4BD',
  '#00B4C8',
  '#0099B6',
  '#006BA3',
  // Pink/Magenta
  '#D87CAC',
  '#FF6B9D',
  '#FF1493',
  '#E60B7A',
  // Purple/Indigo
  '#B45096',
  '#9D4EDD',
  '#7B2CBF',
  '#5A189A',
  // Green/Teal
  '#00FF88',
  '#00E5A0',
  '#32C8DC',
  '#1DB5B5',
  // Orange/Red
  '#FF6B35',
  '#FF8C42',
  '#FF9800',
  '#FF5733',
];

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const colorCount = colors.length;
  const rgbColors = colors.map((color) => hexToRgb(color));

  /**
   * Generate random grid positions - each bubble gets a unique cell
   */
  const bubblePositions = React.useMemo(() => {
    const totalBubbles = colorCount;
    const cols = Math.ceil(Math.sqrt(totalBubbles * 1.5));
    const rows = Math.ceil(totalBubbles / cols) + 1;
    const totalCells = cols * rows;

    // Shuffle available cells
    const availableCells = Array.from({ length: totalCells }, (_, i) => i);
    for (let i = availableCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableCells[i], availableCells[j]] = [
        availableCells[j],
        availableCells[i],
      ];
    }

    // Assign bubbles to random cells
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;

    return availableCells.slice(0, totalBubbles).map((cellIndex) => {
      const col = cellIndex % cols;
      const row = Math.floor(cellIndex / cols);

      const jitterX = (Math.random() - 0.5) * cellWidth * 0.4;
      const jitterY = (Math.random() - 0.5) * cellHeight * 0.4;

      return {
        x: col * cellWidth + cellWidth / 2 + jitterX,
        y: row * cellHeight + cellHeight / 2 + jitterY,
      };
    });
  }, [colorCount]);

  /**
   * Track mouse for interactive mode
   */
  React.useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

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
          0%, 100% { transform: translateY(-30px); }
          50% { transform: translateY(30px); }
        }

        @keyframes drift {
          0%, 100% { transform: translateX(-30px); }
          50% { transform: translateX(30px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .bubble-container {
          position: absolute;
          inset: 0;
          filter: url(#gooey) blur(40px);
          mix-blend-mode: screen;
        }

        ${rgbColors
          .map((_, i) => {
            const animationSpeed = 20 + (i % 3) * 10;
            const animationType = ['float', 'drift', 'pulse'][i % 3];
            const baseSize = 120 + (i % 5) * 25;

            return `
            .bubble-${i} {
              width: ${baseSize}px;
              height: ${baseSize}px;
              border-radius: 50%;
              background: radial-gradient(
                circle at center,
                rgba(var(--bubble-color-${i}), 0.8) 0%,
                rgba(var(--bubble-color-${i}), 0.3) 50%,
                rgba(var(--bubble-color-${i}), 0) 100%
              );
              mix-blend-mode: hard-light;
              animation: ${animationType} ${animationSpeed}s ease-in-out infinite;
              filter: drop-shadow(0 0 20px rgba(var(--bubble-color-${i}), 0.5));
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
          const pos = bubblePositions[i];
          if (!pos) return null;

          // Calculate attraction to mouse if interactive
          let attractX = 0;
          let attractY = 0;

          if (interactive) {
            const dx = mousePosition.x - pos.x;
            const dy = mousePosition.y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
              attractX = dx * 0.3;
              attractY = dy * 0.3;
            }
          }

          return (
            <motion.div
              key={color}
              className={`bubble-${i}`}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                x: '-50%',
                y: '-50%',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: `calc(-50% + ${attractX}px)`,
                y: `calc(-50% + ${attractY}px)`,
              }}
              transition={{
                opacity: { duration: 0.8, ease: 'easeOut', delay: i * 0.05 },
                scale: { duration: 0.8, ease: 'easeOut', delay: i * 0.05 },
                x: interactive
                  ? {
                      type: 'spring',
                      stiffness: transition.stiffness,
                      damping: transition.damping,
                    }
                  : {},
                y: interactive
                  ? {
                      type: 'spring',
                      stiffness: transition.stiffness,
                      damping: transition.damping,
                    }
                  : {},
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
