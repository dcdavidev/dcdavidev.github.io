import { createTheme } from '@mui/material';

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#08A4BD', // Cyan/Turquoise
    },
    secondary: {
      main: '#D87CAC', // Pink
    },
    error: {
      main: '#9B2915', // Red
    },
    warning: {
      main: '#E9B44C', // Yellow/Gold
    },
    success: {
      main: '#004F2D', // Dark Green
    },
    info: {
      main: '#67597A', // Purple
    },
    background: {
      default: '#131B23', // Dark Blue/Black
      paper: '#1a2530', // Slightly lighter than default
    },
    text: {
      primary: '#E9F1F7', // Light Blue/White
      secondary: '#b8c5d0', // Muted version of light blue
    },
  },
  typography: {
    fontFamily: ['Momo Trust Sans', 'sans-serif'].join(','),
    h1: {
      fontFamily: ['Momo Trust Display', 'Momo Trust Sans', 'sans-serif'].join(
        ','
      ),
    },
    h2: {
      fontFamily: ['Momo Trust Display', 'Momo Trust Sans', 'sans-serif'].join(
        ','
      ),
    },
    h3: {
      fontFamily: ['Momo Trust Display', 'Momo Trust Sans', 'sans-serif'].join(
        ','
      ),
    },
    h4: {
      fontFamily: ['Momo Trust Display', 'Momo Trust Sans', 'sans-serif'].join(
        ','
      ),
    },
    h5: {
      fontFamily: ['Momo Trust Display', 'Momo Trust Sans', 'sans-serif'].join(
        ','
      ),
    },
    h6: {
      fontFamily: ['Momo Trust Display', 'Momo Trust Sans', 'sans-serif'].join(
        ','
      ),
    },
  },
});
