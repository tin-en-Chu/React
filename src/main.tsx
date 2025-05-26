import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// set mui theme provider
createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
  </ThemeProvider>
);
