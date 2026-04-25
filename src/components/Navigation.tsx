import { Link, NavLink } from 'react-router-dom';
import { getStoredAuthToken } from '../lib/apiClient';

type NavItem = { path: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { path: '/property-explorer', label: 'Property Explorer' },
  { path: '/neighborhood-intel', label: 'Neighborhood Intel' },
  { path: '/remote-monitor', label: 'Remote Monitor' },
  { path: '/trust-vault', label: 'NRI Trust Vault' },
];

export default function Navigation() {
  const isLoggedIn = Boolean(getStoredAuthToken());

  return (
    <nav
      style={{
        height: 56,
        background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        boxShadow: '0 1px 4px rgba(26,104,112,.08)',
        zIndex: 100,
        position: 'relative',
      }}
    >
      <Link
        to="/property-explorer"
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 32, cursor: 'pointer', textDecoration: 'none' }}
      >
        <div style={{ position: 'relative', width: 22, height: 28 }}>
          <div
            style={{
              width: 22,
              height: 28,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              background: 'var(--c-primary)',
              boxShadow: '0 2px 6px rgba(26,104,112,.35)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--c-surface)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: -1,
              right: -1,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--c-accent)',
            }}
          />
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 700 }}>
          <span style={{ color: 'var(--c-text)' }}>Prop</span>
          <span style={{ color: 'var(--c-primary)' }}>Vault</span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'stretch', height: 56, flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path !== '/property-explorer'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'var(--f-ui)',
              color: isActive ? 'var(--c-primary)' : 'var(--c-text-sm)',
              borderBottom: isActive ? '2.5px solid var(--c-primary)' : '2.5px solid transparent',
              background: 'none',
              borderBottomStyle: 'solid',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 150ms',
              textDecoration: 'none',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {!isLoggedIn && (
          <Link
            to="/login"
            style={{
              fontFamily: 'var(--f-ui)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--c-primary)',
              textDecoration: 'none',
              border: '1px solid var(--c-primary)',
              borderRadius: 999,
              padding: '6px 12px',
            }}
          >
            Login
          </Link>
        )}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--c-primary)',
            color: '#FBF7F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--f-ui)',
          }}
        >
          AK
        </div>
      </div>
    </nav>
  );
}
