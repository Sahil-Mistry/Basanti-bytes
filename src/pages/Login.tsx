import { useState } from 'react';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, AUTH_TOKEN_KEY } from '../lib/apiClient';

type LoginResponse = {
  token?: string;
  accessToken?: string;
  authToken?: string;
  message?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { data } = await apiClient.post<LoginResponse>('/login', {
        email,
        password,
      });

      const token = data.token ?? data.accessToken ?? data.authToken;
      if (token) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      }

      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const apiMessage = axiosError.response?.data?.message;
      setErrorMessage(apiMessage ?? 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at 20% 20%, var(--c-primary-lt), transparent 35%), var(--c-bg)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass"
        style={{
          width: 'min(420px, 100%)',
          borderRadius: 16,
          border: '1px solid var(--c-border)',
          padding: 24,
          display: 'grid',
          gap: 14,
          boxShadow: '0 12px 28px rgba(16, 78, 88, 0.18)',
        }}
      >
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, color: 'var(--c-primary-dk)' }}>
          Sign in
        </h1>

        <label style={{ display: 'grid', gap: 6, fontFamily: 'var(--f-ui)', fontWeight: 600 }}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="you@example.com"
            style={{
              height: 42,
              borderRadius: 10,
              border: '1px solid var(--c-border)',
              padding: '0 12px',
              fontFamily: 'var(--f-body)',
              background: 'var(--c-surface)',
            }}
          />
        </label>

        <label style={{ display: 'grid', gap: 6, fontFamily: 'var(--f-ui)', fontWeight: 600 }}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="••••••••"
            style={{
              height: 42,
              borderRadius: 10,
              border: '1px solid var(--c-border)',
              padding: '0 12px',
              fontFamily: 'var(--f-body)',
              background: 'var(--c-surface)',
            }}
          />
        </label>

        {errorMessage && (
          <p style={{ fontFamily: 'var(--f-ui)', color: '#9A2A18', fontSize: 13 }}>{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            height: 44,
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            background: 'var(--c-primary)',
            color: 'var(--c-surface)',
            fontFamily: 'var(--f-ui)',
            fontWeight: 700,
            opacity: isLoading ? 0.8 : 1,
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p style={{ fontFamily: 'var(--f-ui)', color: 'var(--c-text-md)', fontSize: 13 }}>
          New here? <Link to="/signup">Create an account</Link>
        </p>

        <p style={{ fontFamily: 'var(--f-ui)', color: 'var(--c-text-md)', fontSize: 13 }}>
          Back to dashboard: <Link to="/">Home</Link>
        </p>
      </form>
    </div>
  );
}
