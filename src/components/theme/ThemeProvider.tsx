import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import theme from './theme';

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: MuiThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
