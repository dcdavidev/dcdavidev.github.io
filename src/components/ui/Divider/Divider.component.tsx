'use client';

import { useTheme } from '@mui/material';

// Helper function to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface DividerProps {
  variant?: 'line' | 'wave';
  thickness?: number;
  color?: 'primary' | 'secondary' | string;
  theme?: 'light' | 'dark';
  margin?: 'none' | 'small' | 'normal' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export function DividerComponent({
  variant = 'line',
  thickness = 1,
  color,
  theme = 'light',
  margin = 'normal',
  className = '',
  style = {},
}: DividerProps): React.ReactElement {
  const muiTheme = useTheme();

  let marginValue: number | string = muiTheme.spacing(2);
  switch (margin) {
    case 'none': {
      marginValue = 0;
      break;
    }
    case 'small': {
      marginValue = muiTheme.spacing(1);
      break;
    }
    case 'large': {
      marginValue = muiTheme.spacing(4);
      break;
    }
    default: {
      marginValue = muiTheme.spacing(2);
    }
  }

  // Material Design 3 spec: divider adapts to theme mode
  // Dark theme: white with opacity, Light theme: black with opacity
  // Or use primary/secondary colors with muted opacity
  let dividerColor: string;
  if (color === 'primary') {
    dividerColor = hexToRgba(muiTheme.palette.primary.main, 0.3);
  } else if (color === 'secondary') {
    dividerColor = hexToRgba(muiTheme.palette.secondary.main, 0.3);
  } else if (color) {
    dividerColor = color;
  } else {
    dividerColor =
      theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
  }

  if (variant === 'wave') {
    const waveHeight = 8;
    const wavelength = 91;

    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: `${waveHeight}px`,
          marginTop: `${marginValue}px`,
          marginBottom: `${marginValue}px`,
          ...style,
        }}
      >
        <svg
          aria-hidden="true"
          width="100%"
          height={waveHeight}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="wave-pattern"
              width={wavelength}
              height={waveHeight}
              patternUnits="userSpaceOnUse"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
                  stroke={dividerColor}
                  strokeLinecap="square"
                  strokeWidth={thickness}
                />
              </g>
              <clipPath id="clip0">
                <rect width={wavelength} height={waveHeight} />
              </clipPath>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>
    );
  }

  return (
    <hr
      className={className}
      style={{
        width: '100%',
        border: 'none',
        borderTop: `${thickness}px solid ${dividerColor}`,
        marginTop: `${marginValue}px`,
        marginBottom: `${marginValue}px`,
        ...style,
      }}
    />
  );
}
