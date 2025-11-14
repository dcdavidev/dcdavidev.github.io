'use client';

import * as React from 'react';

import Box, { type BoxProps } from '@mui/material/Box';

export function BoxComponent({
  children,
  ...props
}: BoxProps & React.PropsWithChildren) {
  return <Box {...props}>{children}</Box>;
}
