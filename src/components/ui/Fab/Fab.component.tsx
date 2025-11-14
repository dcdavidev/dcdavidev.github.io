'use client';

import * as React from 'react';

import Fab, { type FabProps } from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';

type FabVariant = 'filled' | 'outlined' | 'filled-outlined';

interface FabComponentProps extends Omit<FabProps, 'variant'> {
  href?: string;
  variant?: FabVariant;
}

// Determine if color is light or dark for contrast
const isLightColor = (hexColor: string) => {
  const rgb = Number.parseInt(hexColor.slice(1), 16);
  // eslint-disable-next-line unicorn/number-literal-case
  const r = (rgb >> 16) & 0xff;
  // eslint-disable-next-line unicorn/number-literal-case
  const g = (rgb >> 8) & 0xff;
  // eslint-disable-next-line unicorn/number-literal-case
  const b = Math.trunc(rgb) & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export function FabComponent({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'large',
  href,
  ...props
}: FabComponentProps & React.PropsWithChildren) {
  const theme = useTheme();

  // Get color from theme palette
  const getColor = () => {
    if (color === 'inherit') return 'inherit';
    const paletteColor = theme.palette[color as keyof typeof theme.palette];
    if (
      paletteColor &&
      typeof paletteColor === 'object' &&
      'main' in paletteColor
    ) {
      return paletteColor.main;
    }
    return theme.palette.primary.main;
  };

  const mainColor = getColor();
  const contrastColor =
    typeof mainColor === 'string' && isLightColor(mainColor) ? '#000' : '#fff';

  const getStyles = () => {
    const baseStyles = {
      borderRadius: '16px',
      textTransform: 'none' as const,
      fontFamily: 'Momo Trust Display',
      letterSpacing: '0.05em',
      fontWeight: 500,
    };

    switch (variant) {
      case 'outlined': {
        return {
          ...baseStyles,
          boxShadow: 'none',
          border: '4px solid',
          borderColor: mainColor,
          backgroundColor: 'transparent',
          color: mainColor,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'action.hover',
            borderColor: mainColor,
          },
          '&:active': {
            boxShadow: 'none',
          },
        };
      }

      case 'filled-outlined': {
        return {
          ...baseStyles,
          boxShadow:
            '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
          border: '2px solid',
          borderColor: contrastColor,
          backgroundColor: mainColor,
          color: contrastColor,
          '&:hover': {
            boxShadow:
              '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
            backgroundColor: mainColor,
            borderColor: contrastColor,
          },
          '&:active': {
            boxShadow:
              '0 7px 8px -4px rgba(0,0,0,.2), 0 12px 17px 2px rgba(0,0,0,.14), 0 5px 22px 4px rgba(0,0,0,.12)',
          },
        };
      }

      default: {
        return {
          ...baseStyles,
          boxShadow:
            '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
          border: 'none',
          '&:hover': {
            boxShadow:
              '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
          },
          '&:active': {
            boxShadow:
              '0 7px 8px -4px rgba(0,0,0,.2), 0 12px 17px 2px rgba(0,0,0,.14), 0 5px 22px 4px rgba(0,0,0,.12)',
          },
        };
      }
    }
  };

  return (
    <Fab
      color={color}
      size={size}
      href={href}
      component={href ? 'a' : 'button'}
      {...props}
      sx={{
        ...getStyles(),
        ...props.sx,
      }}
    >
      {children}
    </Fab>
  );
}
