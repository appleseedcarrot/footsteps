import { useEffect } from 'react';
import { useUser } from '@/contexts/userContext';
import ToggleSwitch from '../toggleSwitch/ToggleSwitch';

export const Popup = () => {
  const { user, isLoading, logout } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('Redirecting to login.html');
      window.location.href = chrome.runtime.getURL('login.html');
    }
  }, [user, isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Redirecting to login...</div>;

  return (
    <main>
      <h1>You should be studying...</h1>
      <ToggleSwitch />
      <button
        onClick={logout}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Log Out
      </button>
    </main>
  );
};

export default Popup;