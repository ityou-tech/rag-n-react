import { useEffect } from 'react';
import AuthenticatorWrapper from './components/AuthenticatorWrapper';
import AuthHeader from './components/AuthHeader';
import ConversationLayout from './components/chat/ConversationLayout';
import { THEME_COLORS } from './constants';
import './App.css';

/* 1️⃣ configure Amplify with the generated outputs */
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);

// Main application component
// This component sets up the authentication and conversation layout for the app.
// It uses the AuthenticatorWrapper to manage user authentication and displays the conversation layout.
// The AuthHeader component is used to show the authenticated user's information and provide a sign-out option
export default function App() {
  // Set body background color properly
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = THEME_COLORS.background;
    
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  return (
    <AuthenticatorWrapper>
      {({ signOut, user }) => (
        <main style={{ position: 'relative', height: '100vh' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 100,
            background: THEME_COLORS.surface + 'f0',
            backdropFilter: 'blur(10px)',
            borderRadius: '0 0 0 12px',
            border: `1px solid ${THEME_COLORS.border}`,
            borderTop: 'none',
            borderRight: 'none',
          }}>
            <AuthHeader
              username={user?.username}
              onSignOut={signOut || (() => {})}
            />
          </div>
          <ConversationLayout />
        </main>
      )}
    </AuthenticatorWrapper>
  );
}
