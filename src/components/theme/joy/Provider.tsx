import React from 'react';

import { CssVarsProvider } from '@mui/joy/styles';

import joyTheme from './theme';

interface JoyThemeProviderProps {
  children: React.ReactNode;
}

export function JoyThemeProvider({ children }: JoyThemeProviderProps) {
  return (
    <CssVarsProvider theme={joyTheme} defaultMode="dark">
      {children}
    </CssVarsProvider>
  );
}
