import { Link, useNavigate } from 'react-router-dom';

const FIELD_STYLE: React.CSSProperties = {
  height: 42,
  borderRadius: 10,
  border: '1px solid var(--c-border)',
  padding: '0 12px',
  fontFamily: 'var(--f-body)',
  background: 'var(--c-surface)',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: 6,
  fontFamily: 'var(--f-ui)',
  fontWeight: 600,
};

export default function SignUp() {
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate('/');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at 80% 0%, var(--c-accent-lt), transparent 30%), var(--c-bg)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass"
        style={{
          width: 'min(560px, 100%)',
          borderRadius: 16,
          border: '1px solid var(--c-border)',
          padding: 24,
          display: 'grid',
          gap: 14,
          boxShadow: '0 12px 28px rgba(16, 78, 88, 0.18)',
        }}
      >
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, color: 'var(--c-primary-dk)' }}>
          Sign up
        </h1>

        <label style={LABEL_STYLE}>
          Name
          <input type="text" name="name" required placeholder="Full name" style={FIELD_STYLE} />
        </label>

        <label style={LABEL_STYLE}>
          Email
          <input type="email" name="email" required placeholder="you@example.com" style={FIELD_STYLE} />
        </label>

        <label style={LABEL_STYLE}>
          Phone
          <input type="tel" name="phone" required placeholder="+1 555 123 4567" style={FIELD_STYLE} />
        </label>

        <label style={LABEL_STYLE}>
          Address
          <input type="text" name="address" required placeholder="Street address" style={FIELD_STYLE} />
        </label>

        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }}>
          <label style={LABEL_STYLE}>
            Country
            <input type="text" name="country" required placeholder="Country" style={FIELD_STYLE} />
          </label>

          <label style={LABEL_STYLE}>
            Zipcode
            <input type="text" name="zipcode" required placeholder="Zipcode" style={FIELD_STYLE} />
          </label>
        </div>

        <button
          type="submit"
          style={{
            height: 44,
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            background: 'var(--c-primary)',
            color: 'var(--c-surface)',
            fontFamily: 'var(--f-ui)',
            fontWeight: 700,
          }}
        >
          Create account
        </button>

        <p style={{ fontFamily: 'var(--f-ui)', color: 'var(--c-text-md)', fontSize: 13 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
