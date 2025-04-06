// import { useState } from 'react';
// import { useUser } from '@/contexts/UserContext';

// export default function LoginPage() {
//   const { login } = useUser();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       await login(email, password);
//       window.location.href = chrome.runtime.getURL('popup.html');
//     } catch (err) {
//       console.error('Login failed', err);
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//       <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import '../login/LoginPage.css'

export default function LoginPage() {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
      window.location.href = chrome.runtime.getURL('popup.html');
    } catch (err) {
      console.error('Login failed', err);
      setError('Invalid email or password.');
    }
  };

  return (
    <main>
      <a href="signup.html" className="signup-button">
        Create a new account
      </a>
      <div className="header">
        <h3>Login</h3>
        <p className="subtitle">Welcome back! Please enter your credentials to continue.</p>
      </div>

      <div className="input-container" style={{ flexDirection: 'column' }}>
        <input
          className="site-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="site-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="add-button" onClick={handleLogin}>Login</button>
    </main>
  );
}