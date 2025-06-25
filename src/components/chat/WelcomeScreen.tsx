import { THEME_COLORS } from '../../constants';

interface WelcomeScreenProps {
  onCreateConversation: () => void;
}

export default function WelcomeScreen({ onCreateConversation }: WelcomeScreenProps) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '500px',
        background: THEME_COLORS.surface,
        borderRadius: '12px',
        border: `1px solid ${THEME_COLORS.border}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '3rem 2rem',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🚀</div>
        <h1 style={{ 
          margin: '0 0 1rem 0', 
          color: THEME_COLORS.primary, 
          fontSize: '2rem',
          fontWeight: '600' 
        }}>
          Welcome to Rag-n-React!
        </h1>
        <p style={{ 
          margin: '0 0 2rem 0', 
          color: THEME_COLORS.textSecondary,
          fontSize: '1.1rem',
          lineHeight: '1.6',
        }}>
          I'm your AI assistant powered by Amazon Bedrock. I can help you with questions about customer teams and platform usage.
        </p>
        <button
          onClick={onCreateConversation}
          style={{
            background: THEME_COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
          }}
        >
          Start New Conversation
        </button>
      </div>
    </div>
  );
}