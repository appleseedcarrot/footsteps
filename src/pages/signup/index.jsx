import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from '@/contexts/UserContext';
import SignupPage from './SignupPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <SignupPage />
  </UserProvider>
);