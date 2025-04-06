import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      window.location.href = chrome.runtime.getURL('popup.html');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}