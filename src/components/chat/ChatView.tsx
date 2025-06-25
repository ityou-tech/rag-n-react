import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from '../../client';
import { THEME_COLORS } from '../../constants';
import '@aws-amplify/ui-react/styles.css';

interface ChatViewProps {
  conversationId?: string;
  hideHeader?: boolean;
}

export default function ChatView({ conversationId, hideHeader = false }: ChatViewProps) {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat', conversationId ? { id: conversationId } : undefined);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: THEME_COLORS.background,
      color: THEME_COLORS.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      {!hideHeader && (
        <div style={{
          background: THEME_COLORS.surface,
          padding: '1rem',
          borderBottom: `1px solid ${THEME_COLORS.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            margin: 0,
            color: THEME_COLORS.primary,
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            🤖 Rag-n-React
          </h1>
          <p style={{
            margin: '0.5rem 0 0 0',
            color: THEME_COLORS.textSecondary,
            fontSize: '0.9rem'
          }}>
            Powered by Amazon Bedrock
          </p>
        </div>
      )}

      {/* Chat Area */}
      <div style={{
        height: hideHeader ? '100vh' : 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem',
      }}>
        <div style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <AIConversation
            messages={messages}
            isLoading={isLoading}
            handleSendMessage={handleSendMessage}
            welcomeMessage={
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
            }
            avatars={{
              user: {
                avatar: <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: THEME_COLORS.userAvatar,
                  fontSize: '1.2rem',
                  color: '#ffffff'
                }}>👤</div>,
                username: 'You'
              },
              ai: {
                avatar: <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: THEME_COLORS.aiAvatar,
                  fontSize: '1.2rem',
                  color: '#ffffff'
                }}>🤖</div>,
                username: 'Rag-n-React'
              }
            }}
            displayText={{
              getMessageTimestampText: (date) => new Intl.DateTimeFormat('en-US', {
                timeStyle: 'short',
                hour12: true,
              }).format(date),
            }}
            allowAttachments={false}
            variant="bubble"
          />
        </div>
      </div>
    </div>
  );
}