'use client';

import * as React from 'react';

import Paper, { type PaperProps } from '@mui/material/Paper';

export function PaperComponent({
  children,
  ...props
}: PaperProps & React.PropsWithChildren) {
  return <Paper {...props}>{children}</Paper>;
}
