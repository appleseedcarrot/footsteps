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

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="loading">Redirecting to login...</div>;

  return (
    <main>
      <h1>You should be studying...</h1>
      
      <div className="toggle-container">
        <ToggleSwitch />
      </div>
      
      <h3>
        <span role="img" aria-label="Friends">👯</span> Friends
      </h3>
      
      {loadingFriends ? (
        <p>Loading friends...</p>
      ) : friends.length === 0 ? (
        <p>You don't have any friends yet.</p>
      ) : (
        <ul>
          {friends.map((f) => (
            <li key={f.id}>
              {f.users?.username || f.users?.email || 'Unknown User'}
              {f.status === 'pending' && <span className="pending">Pending</span>}
            </li>
          ))}
        </ul>
      )}
      
      <button className="logout" onClick={logout}>
        Log Out
      </button>
    </main>
  );
};

export default Popup;
