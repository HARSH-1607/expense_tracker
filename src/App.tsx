import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSelector } from 'react-redux';
import { store } from './features/store';
import { selectUserPreferences } from './features/user/userSlice';
import { lightTheme, darkTheme } from './theme';

// Components
import { Layout } from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Categories from './pages/Categories/Categories';
import Transactions from './pages/Transactions/Transactions';
import SavingsGoals from './pages/SavingsGoals/SavingsGoals';
import Reports from './pages/Reports/Reports';
import Profile from './pages/Profile/Profile';

const AppContent = () => {
  const userPreferences = useSelector(selectUserPreferences);
  const prefersDarkMode = userPreferences?.theme === 'dark' || 
    (userPreferences?.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="savings-goals" element={<SavingsGoals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <AppContent />
        </Router>
      </LocalizationProvider>
    </Provider>
  );
};

export default App; 