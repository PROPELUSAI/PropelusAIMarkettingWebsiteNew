/**
 * Login Page
 *
 * Simple username + password form. On success, redirects to /dashboard.
 * If the user is already authenticated, immediately redirects away.
 * Default credentials: admin / admin123 (see server/seed.js).
 */
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    const success = await login(data.username, data.password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              placeholder="Enter username"
            />
            {errors.username && <span className="error">{errors.username.message}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter password"
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
