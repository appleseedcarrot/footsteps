import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from '@/contexts/userContext';
import FriendsPage from './FriendsPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <FriendsPage />
  </UserProvider>
);