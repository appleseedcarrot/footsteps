import { useEffect } from 'react';
import { useUser } from '@/contexts/userContext';
import { useFriends } from '../hooks/useFriends';
import ToggleSwitch from '../toggleSwitch/ToggleSwitch';

export const Popup = () => {
  const { user, isLoading, logout } = useUser();
  const { friends, loading: loadingFriends } = useFriends(user);

  // Make sure user is logged in, otherwise direct to login/signup
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
      <button className="settings"></button>
      <h3>SNITCH</h3>
      <div className="calc">
        <ToggleSwitch />
      </div>
      <h1>You should be studying...</h1>
      <ToggleSwitch />

      <h3 style={{ marginTop: '1rem' }}>👯 Friends</h3>
      {friends.length === 0 ? (
        <p>You don’t have any friends yet.</p>
      ) : (
        <ul>
          {friends.map((f) => (
            <li key={f.id}>
              {f.users?.username || f.users?.email || 'Unknown User'}{' '}
              {f.status === 'pending' ? '(Pending)' : ''}
            </li>
          ))}
        </ul>
      )}
      
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