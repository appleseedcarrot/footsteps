import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from '@/contexts/UserContext';
import LoginPage from './LoginPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <LoginPage />
  </UserProvider>
);