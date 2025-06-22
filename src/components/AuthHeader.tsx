import { THEME_COLORS } from '../constants';

interface AuthHeaderProps {
  username?: string;
  onSignOut: () => void;
}

export default function AuthHeader({ username, onSignOut }: AuthHeaderProps) {
  return (
    <div style={{
      background: THEME_COLORS.surface,
      padding: '0.75rem 1rem',
      borderBottom: `1px solid ${THEME_COLORS.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '1rem',
        color: THEME_COLORS.primary,
        fontWeight: '500'
      }}>
        Hello {username}
      </h1>
      <button
        onClick={onSignOut}
        style={{
          background: '#dc2626',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          color: 'white',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#b91c1c';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#dc2626';
        }}
      >
        Sign out
      </button>
    </div>
  );
}