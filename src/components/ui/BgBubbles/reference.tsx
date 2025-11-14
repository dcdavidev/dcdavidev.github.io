'use client';

import * as React from 'react';

type BubbleBackgroundProps = React.ComponentProps<'div'> & {
  interactive?: boolean;
  transition?: {
    stiffness: number;
    damping: number;
  };
  colors?: {
    first: string;
    second: string;
    third: string;
    fourth: string;
    fifth: string;
    sixth: string;
  };
};

function BubbleBackground({
  ref,
  className,
  children,
  interactive = false,
  transition = { stiffness: 100, damping: 20 },
  colors = {
    first: '18,113,255',
    second: '221,74,255',
    third: '0,220,255',
    fourth: '200,50,50',
    fifth: '180,180,50',
    sixth: '140,100,255',
  },
  ...props
}: BubbleBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);
  const springX = React.useRef(0);
  const springY = React.useRef(0);
  const sixthBubbleRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!interactive || !sixthBubbleRef.current) return;

    const animate = () => {
      const stiffness = transition.stiffness / 1000;
      const damping = transition.damping / 100;

      springX.current += (mouseX.current - springX.current) * stiffness;
      springY.current += (mouseY.current - springY.current) * stiffness;
      springX.current *= damping;
      springY.current *= damping;

      if (sixthBubbleRef.current) {
        sixthBubbleRef.current.style.transform = `translate(${springX.current}px, ${springY.current}px)`;
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
      data-slot="bubble-background"
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, #3d0066 0%, #1a0033 50%, #0d001a 100%)',
      }}
      {...props}
    >
      <style>{`
        :root {
          --first-color: ${colors.first};
          --second-color: ${colors.second};
          --third-color: ${colors.third};
          --fourth-color: ${colors.fourth};
          --fifth-color: ${colors.fifth};
          --sixth-color: ${colors.sixth};
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
          filter: url(#goo) blur(40px);
          mix-blend-mode: screen;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          filter: drop-shadow(0 0 20px rgba(var(--first-color), 0.4));
        }

        .bubble-1 {
          top: 10%;
          left: 10%;
          width: 80%;
          height: 80%;
          background: radial-gradient(
            circle at center,
            rgba(var(--first-color), 0.8) 0%,
            rgba(var(--first-color), 0) 50%
          );
          mix-blend-mode: hard-light;
          animation: float 30s ease-in-out infinite;
        }

        .bubble-2 {
          top: 50%;
          left: 50%;
          width: 80%;
          height: 80%;
          background: radial-gradient(
            circle at center,
            rgba(var(--second-color), 0.8) 0%,
            rgba(var(--second-color), 0) 50%
          );
          mix-blend-mode: hard-light;
          animation: rotate 20s linear infinite;
          transform-origin: calc(50% - 400px) 50%;
          margin-left: -40%;
          margin-top: -40%;
        }

        .bubble-3 {
          top: calc(50% + 200px);
          left: calc(50% - 500px);
          width: 80%;
          height: 80%;
          background: radial-gradient(
            circle at center,
            rgba(var(--third-color), 0.8) 0%,
            rgba(var(--third-color), 0) 50%
          );
          mix-blend-mode: hard-light;
        }

        .bubble-3-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: rotate 40s linear infinite;
          transform-origin: calc(50% + 400px) 50%;
        }

        .bubble-4 {
          top: 10%;
          left: 10%;
          width: 80%;
          height: 80%;
          background: radial-gradient(
            circle at center,
            rgba(var(--fourth-color), 0.8) 0%,
            rgba(var(--fourth-color), 0) 50%
          );
          mix-blend-mode: hard-light;
          opacity: 0.7;
          animation: drift 40s ease-in-out infinite;
        }

        .bubble-5 {
          top: calc(50% - 80%);
          left: calc(50% - 80%);
          width: 160%;
          height: 160%;
          background: radial-gradient(
            circle at center,
            rgba(var(--fifth-color), 0.8) 0%,
            rgba(var(--fifth-color), 0) 50%
          );
          mix-blend-mode: hard-light;
        }

        .bubble-5-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: rotate 20s linear infinite;
          transform-origin: calc(50% - 800px) calc(50% + 200px);
        }

        .bubble-6 {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(var(--sixth-color), 0.8) 0%,
            rgba(var(--sixth-color), 0) 50%
          );
          mix-blend-mode: hard-light;
          opacity: 0.7;
          will-change: transform;
        }
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
          <filter id="goo">
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
        <div className="bubble bubble-1" />

        <div className="bubble-3-container">
          <div className="bubble bubble-2" />
        </div>

        <div className="bubble-3-container">
          <div className="bubble bubble-3" />
        </div>

        <div className="bubble bubble-4" />

        <div className="bubble-5-container">
          <div className="bubble bubble-5" />
        </div>

        {interactive && (
          <div ref={sixthBubbleRef} className="bubble bubble-6" />
        )}
      </div>

      {children}
    </div>
  );
}

export { BubbleBackground, type BubbleBackgroundProps };
