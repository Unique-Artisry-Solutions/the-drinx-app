
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { DevelopmentModeProvider } from './contexts/DevelopmentModeContext';
import './App.css';

function App() {
  return (
    <DevelopmentModeProvider>
      <ThemeProvider>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </ThemeProvider>
    </DevelopmentModeProvider>
  );
}

export default App;
