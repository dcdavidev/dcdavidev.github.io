'use client';

import * as React from 'react';

import { Typography, useTheme } from '@mui/material';
import { type TypographyProps } from '@mui/material/Typography';

interface TypographyComponentProps
  extends TypographyProps,
    React.PropsWithChildren {
  shadow?:
    | 'auto'
    | 'none'
    | 'primary'
    | 'secondary'
    | 'white'
    | 'black'
    | string
    | false;
  bold?: boolean;
  italic?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#08A4BD',
  secondary: '#D87CAC',
};

function hexToRgba(hex: string, alpha: number = 0.8): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getContrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function TypographyComponent({
  children,
  variant,
  color,
  shadow = 'auto',
  bold = false,
  italic = false,
  ...props
}: TypographyComponentProps) {
  const theme = useTheme();
  const isHeading = variant?.startsWith('h');

  let shadowColor: string;

  if (isHeading) {
    let shadowRgba = '';

    if (shadow !== false && shadow !== 'none') {
      if (shadow === 'auto') {
        // Auto-detect based on text color
        let textColor = color as string;

        if (!textColor || textColor === 'inherit') {
          const sxColor = (props.sx as Record<string, unknown>)?.color;
          textColor = (sxColor as string) || '';
        }

        if (!textColor) {
          // Determina il colore dal prop color di MUI
          textColor = theme.palette.text.primary;
        }

        const hexColor = COLOR_MAP[textColor] || (textColor as string);
        shadowColor = getContrastColor(hexColor);
      } else {
        shadowColor = COLOR_MAP[shadow as string] || (shadow as string);
      }

      const shadowHex = COLOR_MAP[shadowColor] || (shadowColor as string);
      shadowRgba = hexToRgba(shadowHex);
    }

    return (
      <Typography
        variant={variant}
        color={color}
        {...props}
        sx={{
          fontFamily: 'Momo Trust Display, sans-serif',
          ...(shadowRgba && {
            textShadow: `2px 2px 0px ${shadowRgba}`,
          }),
          fontWeight: bold ? 700 : undefined,
          fontStyle: italic ? 'italic' : undefined,
          ...props.sx,
        }}
      >
        {children}
      </Typography>
    );
  }

  return (
    <Typography
      variant={variant}
      color={color}
      {...props}
      sx={{
        fontFamily: 'Momo Trust Sans, sans-serif',
        fontWeight: bold ? 700 : undefined,
        fontStyle: italic ? 'italic' : undefined,
        ...props.sx,
      }}
    >
      {children}
    </Typography>
  );
}
