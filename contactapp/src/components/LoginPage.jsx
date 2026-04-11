import { useState } from 'react';
import { login } from '../api/AuthService';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      onLogin();
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-box'>
        <div className='login-box__brand'>
          <i className='bi bi-person-lines-fill'></i>
          <span>ContactApp</span>
        </div>
        <h2>Welcome back</h2>
        <p>Sign in to manage your contacts</p>
        <form onSubmit={handleSubmit}>
          <div className='input-box'>
            <span className='details'>Username</span>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className='input-box'>
            <span className='details'>Password</span>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && (
            <p className='login-error'>
              <i className='bi bi-exclamation-circle'></i> {error}
            </p>
          )}
          <button type='submit' className='btn' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
