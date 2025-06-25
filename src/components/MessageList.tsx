import { Message } from '../types';
import { THEME_COLORS } from '../constants';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: THEME_COLORS.surface,
        borderRadius: '12px',
        border: `1px solid ${THEME_COLORS.border}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          color: THEME_COLORS.primary, 
          fontWeight: '600' 
        }}>
          Welcome to Rag-n-React!
        </h2>
        <p style={{ margin: 0, color: THEME_COLORS.textSecondary }}>
          I'm your AI assistant powered by Amazon Bedrock. Ask me anything to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => (
        <div key={message.id || index} style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: message.role === 'user'
              ? THEME_COLORS.userAvatar
              : THEME_COLORS.aiAvatar,
            fontSize: '1.2rem',
            color: '#ffffff'
          }}>
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              background: message.role === 'user'
                ? THEME_COLORS.userMessage
                : THEME_COLORS.aiMessage,
              border: message.role === 'user'
                ? `1px solid ${THEME_COLORS.userBorder}`
                : `1px solid ${THEME_COLORS.aiBorder}`,
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {message.content.map((content, i) => (
                <span key={i}>{content.text}</span>
              ))}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: THEME_COLORS.textMuted,
              marginTop: '0.25rem'
            }}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}