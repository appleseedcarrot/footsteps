import { useState } from 'react';
import { useUser } from '@/contexts/userContext';
import { useFriends } from '@/hooks/useFriends'; // Assuming it's in hooks folder

export default function FriendsPage() {
  const { user } = useUser();
  const { friends, loading } = useFriends(user);
  console.log('your friends', friends);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const tokenPromise = () =>
    new Promise((resolve) =>
      chrome.storage.local.get('authToken', (res) => resolve(res.authToken))
    );

  const handleRequest = async () => {
    setMessage('');

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email.');
      return;
    }
  
    if (email === user.email) {
      setMessage("You can't friend yourself");
      return;
    }
  
    const alreadyFriend = friends.some(
      (f) =>
        f.user?.email === email &&
        (f.status === 'accepted' || f.status === 'pending')
    );
  
    if (alreadyFriend) {
      setMessage('You already sent a request or are already friends.');
      return;
    }
    
    const token = await tokenPromise();
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendEmail: email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Friend request sent!');
      setEmail('');
      setRefreshKey((k) => k + 1); // optional: trigger re-fetch manually
    } else {
      setMessage(data.error || 'Failed to send request');
    }
  };

  const handleAccept = async (friendId) => {
    const token = await tokenPromise();
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/friends/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Friend request accepted!');
      setRefreshKey((k) => k + 1);
    } else {
      setMessage(data.error || 'Failed to accept request');
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Friends</h1>

      {message && <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button onClick={handleRequest} style={{ marginTop: '0.5rem', width: '100%' }}>
          Send Friend Request
        </button>
      </div>

      <h2>Pending Requests</h2>
      <ul>
        {friends
          .filter((f) => f.status === 'pending')
          .map((f) => (
            <li key={f.id}>
              {f.user.email}{' '}
              {!f.isSender && (
                <button onClick={() => handleAccept(f.friendId)}>Accept</button>
              )}
            </li>
          ))}
      </ul>

      <h2>Friends</h2>
      <ul>
        {friends
          .filter((f) => f.status === 'accepted')
          .map((f) => (
            <li key={f.id}>{f.user.username || f.user.email}</li>
          ))}
      </ul>
    </div>
  );
}