'use client';

import * as React from 'react';

import Button, { type ButtonProps } from '@mui/material/Button';

export function ButtonComponent({
  children,
  variant = 'contained',
  ...props
}: ButtonProps & React.PropsWithChildren) {
  return (
    <Button
      variant={variant}
      {...props}
      sx={{
        boxShadow: 'none',
        textTransform: 'none',
        fontFamily: 'Momo Trust Display',
        letterSpacing: '0.05em',
        borderRadius: '24px',
        paddingX: '24px',
        paddingY: '10px',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&:active': {
          boxShadow: 'none',
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
