import { useEffect } from 'react';
import { useUser } from '@/contexts/userContext';
import { useFriends } from '../hooks/useFriends';
import { sendJumpscare } from '../utils/sendJumpscare';
import ToggleSwitch from '../toggleSwitch/ToggleSwitch';
import '../popup/Popup.css'

export const Popup = () => {
  const { user, isLoading, logout } = useUser();
  const { friends, loading: loadingFriends } = useFriends(user);

  console.log("use friends:", friends);

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
        Friends
      </h3>
      
      {loadingFriends ? (
        <p>Loading friends...</p>
      ) : friends.length === 0 ? (
        <p>You don't have any friends yet.</p>
      ) : (
        <ul>
          {friends.map((f) => {
            const lastSeen = f.user?.last_seen;
            const isOnline = lastSeen && (new Date() - new Date(lastSeen)) < 30 * 1000;

            return (
              <li key={f.id}>
                {f.user?.username || f.user?.email || 'Unknown User'}
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: isOnline ? 'green' : 'gray',
                    marginLeft: 6,
                  }}
                  title={isOnline ? 'Online' : 'Offline'}
                />
                {f.status === 'pending' ? ' (Pending)' : ''}
                {isOnline && f.status === 'accepted' && (
                  <button
                    style={{
                      marginLeft: '8px',
                      padding: '2px 6px',
                      fontSize: '0.75rem',
                      backgroundColor: '#f87171',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={async() => {
                      try {
                        await sendJumpscare(f.friendId);
                        alert(`Sent jumpscare to ${f.user.username || f.user.email}!`);
                      } catch (err) {
                        alert(err.message || 'Failed to send jumpscare');
                      }
                    }}
                  >
                    Jumpscare
                  </button> )}
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={() => {
          const url = chrome.runtime.getURL('friends.html');
          window.open(url, '_blank');
        }}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgb(41, 41, 41)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Manage Friends
      </button>
      
      <button className="logout" onClick={logout}>
        Log Out
      </button>
    </main>
  );
};

export default Popup;
