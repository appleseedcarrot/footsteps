import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import '../signup/SignupPage.css'

export default function SignupPage() {
  const { signup } = useUser();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async () => {
    setMessage('');
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    setLoading(true);
    try {
      const success = await signup(email, password, username);
      if (success) {
        setMessage('Signup successful! Please check your email to verify your account.');
      }
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="header">
        <h3>Sign Up</h3>
        <p className="subtitle">Create an account to get started</p>
      </div>

      {message && <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="input-container">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="site-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="site-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="site-input"
          maxLength={128}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="site-input"
          maxLength={128}
        />
        <button
          onClick={handleSignup}
          disabled={loading}
          className="add-button"
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>
    </main>
  );
}