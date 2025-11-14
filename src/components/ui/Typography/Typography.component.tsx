'use client';

import * as React from 'react';

import { Typography as MuiTypography } from '@mui/material';
import { type TypographyProps } from '@mui/material/Typography';

export function TypographyComponent({
  children,
  ...props
}: TypographyProps & React.PropsWithChildren) {
  return <MuiTypography {...props}>{children}</MuiTypography>;
}
