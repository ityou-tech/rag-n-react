import { useEffect } from 'react';
import AuthenticatorWrapper from './components/AuthenticatorWrapper';
import AuthHeader from './components/AuthHeader';
import ChatBot from './components/ChatBot';
import { THEME_COLORS } from './constants';
import './App.css';

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
        <main>
          <AuthHeader
            username={user?.username}
            onSignOut={signOut || (() => {})}
          />
          <ChatBot />
        </main>
      )}
    </AuthenticatorWrapper>
  );
}
