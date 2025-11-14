'use client';

import * as React from 'react';

import Fab, { type FabProps } from '@mui/material/Fab';

interface FabComponentProps extends FabProps {
  href?: string;
}

export function FabComponent({
  children,
  variant = 'circular',
  color = 'primary',
  size = 'large',
  href,
  ...props
}: FabComponentProps & React.PropsWithChildren) {
  return (
    <Fab
      variant={variant}
      color={color}
      size={size}
      href={href}
      component={href ? 'a' : 'button'}
      {...props}
      sx={{
        borderRadius: '16px',
        boxShadow:
          '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
        textTransform: 'none',
        fontFamily: 'Momo Trust Display',
        letterSpacing: '0.05em',
        fontWeight: 500,
        '&:hover': {
          boxShadow:
            '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
        },
        '&:active': {
          boxShadow:
            '0 7px 8px -4px rgba(0,0,0,.2), 0 12px 17px 2px rgba(0,0,0,.14), 0 5px 22px 4px rgba(0,0,0,.12)',
        },
        ...props.sx,
      }}
    >
      {children}
    </Fab>
  );
}
