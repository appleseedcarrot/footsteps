import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

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

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sign Up</h1>

      {message && <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        maxLength={128}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        maxLength={128}
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        style={{
          width: '100%',
          backgroundColor: '#4f46e5',
          color: '#fff',
          padding: '0.75rem',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </div>
  );
}