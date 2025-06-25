import { AIConversation } from '@aws-amplify/ui-react-ai';
import { Card } from '@aws-amplify/ui-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useAIConversation } from '../../client';
import { responseComponents } from './ResponseComponents';
import { ReasoningDisplay, InlineReasoningDisplay } from './ReasoningDisplay';
import { parseMessageWithReasoning, shouldUseInlineReasoning } from '../../utils/messageParser';
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
            responseComponents={responseComponents}
            FallbackResponseComponent={(props) => (
              <Card variation="outlined" backgroundColor={THEME_COLORS.surface}>
                <pre style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  color: THEME_COLORS.textSecondary,
                  fontSize: '0.875rem'
                }}>
                  {JSON.stringify(props, null, 2)}
                </pre>
              </Card>
            )}
            messageRenderer={{
              text: ({ text }) => {
                const { reasoning, content } = parseMessageWithReasoning(text);
                const useInline = reasoning ? shouldUseInlineReasoning(reasoning) : false;
                
                return (
                  <>
                    {reasoning && (
                      useInline ?
                        <InlineReasoningDisplay reasoning={reasoning} /> :
                        <ReasoningDisplay reasoning={reasoning} />
                    )}
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                    // Custom styling for markdown elements
                    p: ({children}) => <p style={{ margin: '0.5rem 0' }}>{children}</p>,
                    h1: ({children}) => <h1 style={{ margin: '1rem 0 0.5rem', color: THEME_COLORS.primary }}>{children}</h1>,
                    h2: ({children}) => <h2 style={{ margin: '1rem 0 0.5rem', color: THEME_COLORS.primary }}>{children}</h2>,
                    h3: ({children}) => <h3 style={{ margin: '0.75rem 0 0.5rem', color: THEME_COLORS.primary }}>{children}</h3>,
                    pre: ({children}) => (
                      <pre style={{
                        backgroundColor: '#1e1e1e',
                        padding: '1rem',
                        borderRadius: '6px',
                        overflow: 'auto',
                        margin: '0.5rem 0',
                        color: '#f8f8f2',
                        fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}>
                        {children}
                      </pre>
                    ),
                    code: ({children, ...props}) => {
                      const inline = !(props as any).node?.position;
                      return inline ? (
                        <code style={{
                          backgroundColor: THEME_COLORS.surface,
                          padding: '0.125rem 0.25rem',
                          borderRadius: '3px',
                          fontSize: '0.875em',
                          fontFamily: 'monospace'
                        }}>
                          {children}
                        </code>
                      ) : (
                        <code>{children}</code>
                      );
                    },
                    blockquote: ({children}) => (
                      <blockquote style={{
                        borderLeft: `4px solid ${THEME_COLORS.primary}`,
                        margin: '0.5rem 0',
                        paddingLeft: '1rem',
                        color: THEME_COLORS.textSecondary
                      }}>
                        {children}
                      </blockquote>
                    ),
                    ul: ({children}) => <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>{children}</ul>,
                    ol: ({children}) => <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>{children}</ol>,
                    li: ({children}) => <li style={{ margin: '0.25rem 0' }}>{children}</li>,
                    a: ({href, children}) => (
                      <a href={href} style={{ color: THEME_COLORS.primary, textDecoration: 'none' }}
                         onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                         onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                        {children}
                      </a>
                    ),
                    table: ({children}) => (
                      <table style={{ 
                        borderCollapse: 'collapse', 
                        margin: '0.5rem 0',
                        width: '100%'
                      }}>
                        {children}
                      </table>
                    ),
                    th: ({children}) => (
                      <th style={{ 
                        border: `1px solid ${THEME_COLORS.border}`,
                        padding: '0.5rem',
                        backgroundColor: THEME_COLORS.surface,
                        textAlign: 'left'
                      }}>
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td style={{ 
                        border: `1px solid ${THEME_COLORS.border}`,
                        padding: '0.5rem'
                      }}>
                        {children}
                      </td>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
                  </>
                );
              },
              image: ({ image }) => {
                // Convert ArrayBuffer to base64 for display
                const base64 = btoa(
                  new Uint8Array(image.source.bytes as ArrayBuffer).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                  )
                );
                return (
                  <img
                    src={`data:image/${image.format};base64,${base64}`}
                    alt="Uploaded image"
                    style={{
                      maxWidth: '100%',
                      borderRadius: '8px',
                      margin: '0.5rem 0'
                    }}
                  />
                );
              }
            }}
            welcomeMessage={
              <Card variation="outlined" backgroundColor={THEME_COLORS.surface}>
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                  <h2 style={{
                    margin: '0 0 1rem 0',
                    color: THEME_COLORS.primary,
                    fontWeight: '600'
                  }}>
                    Welcome to Rag-n-React!
                  </h2>
                  <p style={{ margin: '0 0 1rem 0', color: THEME_COLORS.textSecondary }}>
                    I'm your AI assistant powered by Amazon Bedrock. I can help you with information about customer teams and more!
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginTop: '1rem'
                  }}>
                    <div style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: THEME_COLORS.background,
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      color: THEME_COLORS.text
                    }}>
                      💡 Ask about teams
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: THEME_COLORS.background,
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      color: THEME_COLORS.text
                    }}>
                      📊 Query team data
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: THEME_COLORS.background,
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      color: THEME_COLORS.text
                    }}>
                      🔍 Get team counts
                    </div>
                  </div>
                </div>
              </Card>
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
            allowAttachments={true}
            variant="bubble"
            aiContext={() => ({
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              timestamp: new Date().toISOString(),
            })}
          />
        </div>
      </div>
    </div>
  );
}