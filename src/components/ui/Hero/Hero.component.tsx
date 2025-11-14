'use client';

import type { PaperProps, SxProps, Theme } from '@mui/material';
import { Container, Paper, useTheme } from '@mui/material';

interface HeroProps extends React.PropsWithChildren {
  contained?: boolean;
  size?: 'small' | 'medium' | 'large' | 'screen';
  color?: PaperProps['color'];
  bgImage?: string;
  sx?: SxProps<Theme>;
}

const SIZE_SPACING_MAP = {
  small: 2,
  medium: 6,
  large: 8,
  screen: 0,
} as const;

export function HeroComponent({
  children,
  contained = false,
  size = 'large',
  color,
  bgImage,
  sx = {},
}: HeroProps): React.ReactElement {
  const theme = useTheme();
  const spacing = SIZE_SPACING_MAP[size];

  const baseSx: SxProps<Theme> = {
    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    ...(size === 'screen'
      ? {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }
      : {
          py: theme.spacing(spacing),
        }),
  };

  const content = contained ? (
    children
  ) : (
    <Container maxWidth="lg">{children}</Container>
  );

  return (
    <Paper elevation={0} color={color} sx={{ ...baseSx, ...sx }}>
      {content}
    </Paper>
  );
}
