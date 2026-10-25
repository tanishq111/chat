import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  getErrorMessage } from '../api/client.js';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/auth.css';

// Mirrors the backend rules for feedback only — the server still decides.
const passwordRules = [
  { label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
  { label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { label: 'One number', test: (value) => /[0-9]/.test(value) },
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      navigate('/login', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-card__header">
          <p className="auth-eyebrow">letsChat</p>
          <h1>Create account</h1>
          <p className="auth-subtitle">It takes about twenty seconds.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <p className="auth-alert" role="alert">
              {error}
            </p>
          )}

          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="tanishq"
              disabled={isSubmitting}
              minLength={3}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              minLength={8}
              required
            />
          </div>

          <ul className="auth-rules" aria-live="polite">
            {passwordRules.map((rule) => {
              const passed = rule.test(form.password);

              return (
                <li
                  key={rule.label}
                  className={passed ? 'auth-rule auth-rule--ok' : 'auth-rule'}
                >
                  <span aria-hidden="true">{passed ? '✓' : '○'}</span>
                  {rule.label}
                </li>
              );
            })}
          </ul>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              minLength={8}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
};

export default SignUpPage;