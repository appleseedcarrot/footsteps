import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/userContext';
import { useFriends } from '../hooks/useFriends';
import { sendJumpscare } from '../utils/sendJumpscare';
import ToggleSwitch from './toggleSwitch/ToggleSwitch';
import placeholderPic from '@/assets/avatar-placeholder.png';
import '../popup/Popup.css';
import { supabase } from '../utils/supabaseClient';

export const Popup = () => {
  const { user, isLoading, logout } = useUser();
  const [refreshCount, setRefreshCount] = useState(0);
  const { friends, loading: loadingFriends } = useFriends(user, refreshCount);
  const [loadingJumpscareId, setLoadingJumpscareId] = useState(null);

  const handleSendJumpscare = async (friendId) => {
    setLoadingJumpscareId(friendId);
    console.log("supabase:", supabase);

    try {
      const scare = await sendJumpscare(friendId); // should return jumpscare id
      console.log("scare,", scare);
  
      const timeout = setTimeout(async () => {
        const { data, error } = await supabase
          .from('jumpscares')
          .select('result')
          .eq('id', scare.id)
          .single();
        
        console.log(data);
  
        setLoadingJumpscareId(null);
  
        if (error || !data) {
          alert('Could not determine outcome ');
          return;
        }
  
        if (data.result === 'caught') {
          alert('Success! They got jumpscared');
        } else if (data.result === 'escaped') {
          alert('They escaped');
        } else {
          alert(`Unknown result: ${data.result}`);
        }

        setRefreshCount(count => count + 1);
      }, 7000); // Wait 7s for jumpscare to resolve
  
    } catch (err) {
      setLoadingJumpscareId(null);
      alert(err.message || 'Failed to send jumpscare');
  }};

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

      <h3>Friends</h3>
      <button
        style={{
          marginBottom: '1rem',
          padding: '0.3rem 0.7rem',
          fontSize: '0.8rem',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => setRefreshCount(prev => prev + 1)}
      >
        Refresh
      </button>

      {loadingFriends ? (
        <p>Loading friends...</p>
      ) : friends.filter(f => f.status === 'accepted').length === 0 ? (
        <p>You don't have any friends yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {friends
            .filter((f) => f.status === 'accepted')
            .map((f) => {
              let lastSeen = f.user?.last_seen;
              const isOnline = lastSeen && (new Date() - new Date(lastSeen)) < 30 * 1000;

              return (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={f.user?.avatar_url || placeholderPic}
                      alt="Avatar"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        marginRight: '0.75rem',
                        objectFit: 'cover',
                      }}
                    />
                    <div>
                      <div>{f.user?.username || f.user?.email || 'Unknown User'}</div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: isOnline ? 'green' : 'gray',
                        }}
                      >
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>

                  {isOnline && f.status === 'accepted' && (
                    loadingJumpscareId === f.friendId ? (
                      <div className="spinner" style={{ marginLeft: '10px' }} />
                    ) : (
                    <button
                      style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleSendJumpscare(f.friendId)}
                      >
                      Jumpscare
                      </button>
                      ))}
                </div>
              );
            })}
        </div>
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