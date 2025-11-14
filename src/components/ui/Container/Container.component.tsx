'use client';

import * as React from 'react';

import Container, { type ContainerProps } from '@mui/material/Container';

export function ContainerComponent({
  children,
  ...props
}: ContainerProps & React.PropsWithChildren) {
  return <Container {...props}>{children}</Container>;
}
