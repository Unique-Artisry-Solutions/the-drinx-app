
import React from 'react';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
