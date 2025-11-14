'use client';

import { Container, useTheme } from '@mui/material';

import { BgBubblesComponent } from '../BgBubbles/BgBubbles.component';

type BackgroundConfig =
  | false
  | { variant: 'image'; url: string }
  | {
      variant: 'bubbles';
      interactive?: boolean;
      colors?: string[];
      transition?: { stiffness: number; damping: number };
    }
  | { variant: 'color'; color: string };

interface HeroProps extends React.PropsWithChildren {
  contained?: boolean;
  size?: 'small' | 'medium' | 'large' | 'screen';
  background?: BackgroundConfig;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_SPACING_MAP = {
  small: 2,
  medium: 6,
  large: 8,
  screen: 0,
} as const;

function isBackgroundConfig(
  bg: BackgroundConfig
): bg is Exclude<BackgroundConfig, false> {
  return bg !== false;
}

export function HeroComponent({
  children,
  contained = false,
  size = 'large',
  background = false,
  className = '',
  style = {},
}: HeroProps): React.ReactElement {
  const theme = useTheme();
  const spacing = SIZE_SPACING_MAP[size];

  const baseSx = {
    backgroundColor:
      isBackgroundConfig(background) && background.variant === 'color'
        ? background.color
        : 'transparent',
    backgroundImage:
      isBackgroundConfig(background) && background.variant === 'image'
        ? `url(${background.url})`
        : 'none',
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

  if (
    isBackgroundConfig(background) &&
    background.variant === 'bubbles' &&
    size === 'screen'
  ) {
    return (
      <BgBubblesComponent
        interactive={background.interactive ?? true}
        colors={background.colors}
        transition={background.transition}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {content}
        </div>
      </BgBubblesComponent>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: baseSx.backgroundColor as string,
        backgroundImage: baseSx.backgroundImage as string,
        backgroundSize: baseSx.backgroundSize as string,
        backgroundPosition: baseSx.backgroundPosition as string,
        minHeight: size === 'screen' ? '100vh' : 'auto',
        display: size === 'screen' ? 'flex' : 'block',
        flexDirection: size === 'screen' ? 'column' : 'row',
        justifyContent: size === 'screen' ? 'center' : 'flex-start',
        padding: size === 'screen' ? '0' : `${theme.spacing(spacing)}px`,
        ...style,
      }}
    >
      {content}
    </div>
  );
}
