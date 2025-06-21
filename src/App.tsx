import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { View, Heading, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { client } from './client';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: Array<{ text: string }>;
  createdAt: string;
}

function ChatBot() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<any>(null);

  useEffect(() => {
    // Initialize conversation when component mounts
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      console.log('Creating conversation...');
      const { data: conversation } = await client.conversations.chat.create();
      conversationRef.current = conversation;

      // Listen for AI responses
      if (conversation) {
        conversation.onStreamEvent({
          next: (event: any) => {
            console.log('Stream event:', event);
            
            if (event.text) {
              // Update the streaming AI response by accumulating text chunks
              setMessages(prev => {
                const filtered = prev.filter(m => m.id !== 'temp-ai');
                const existingAiIndex = filtered.findIndex(m => m.role === 'assistant' && m.id === 'streaming-ai');
                
                if (existingAiIndex >= 0) {
                  // Update existing streaming message
                  const updated = [...filtered];
                  updated[existingAiIndex] = {
                    ...updated[existingAiIndex],
                    content: [{ text: updated[existingAiIndex].content[0].text + event.text }]
                  };
                  return updated;
                } else {
                  // Create new streaming message
                  const aiMessage: Message = {
                    id: 'streaming-ai',
                    role: 'assistant',
                    content: [{ text: event.text }],
                    createdAt: new Date().toISOString()
                  };
                  return [...filtered, aiMessage];
                }
              });
            }
            
            // Check if streaming is complete
            if (event.stopReason || event.id?.includes('#complete')) {
              setIsLoading(false);
              // Finalize the streaming message with a proper ID
              setMessages(prev =>
                prev.map(m => m.id === 'streaming-ai' ? { ...m, id: `ai-${Date.now()}` } : m)
              );
            }
          },
          error: (error: any) => {
            console.error('Stream error:', error);
            setIsLoading(false);
          }
        });
      }

      console.log('Conversation initialized successfully');
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !conversationRef.current) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: [{ text: messageText }],
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add temporary loading message
    const tempAiMessage: Message = {
      id: 'temp-ai',
      role: 'assistant',
      content: [{ text: 'AI is thinking...' }],
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempAiMessage]);

    try {
      console.log('Sending message:', messageText);
      await conversationRef.current.sendMessage({
        content: [{ text: messageText }],
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== 'temp-ai'));
      setInputValue(messageText); // Restore input on error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          margin: 0,
          color: '#3b82f6',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          🤖 Rag n React
        </h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
          Powered by Amazon Nova Micro
        </p>
      </div>

      {/* Chat Area */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Messages */}
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
              <h2 style={{ margin: '0 0 1rem 0', color: '#3b82f6', fontWeight: '600' }}>Welcome to Rag n React!</h2>
              <p style={{ margin: 0, color: '#64748b' }}>
                I'm your AI assistant powered by Amazon Nova Micro. Ask me anything to get started!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
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
                    ? '#3b82f6'
                    : '#8b5cf6',
                  fontSize: '1.2rem',
                  color: '#ffffff'
                }}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    background: message.role === 'user'
                      ? '#eff6ff'
                      : '#f3f4f6',
                    border: message.role === 'user'
                      ? '1px solid #dbeafe'
                      : '1px solid #e5e7eb',
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
                    color: '#9ca3af',
                    marginTop: '0.25rem'
                  }}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#1e293b',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!(!inputValue.trim() || isLoading)) {
                e.currentTarget.style.background = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!(!inputValue.trim() || isLoading)) {
                e.currentTarget.style.background = '#3b82f6';
              }
            }}
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Beautiful modern theme for Amplify Authenticator
  const authenticatorStyles = `
    /* Beautiful gradient background */
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      min-height: 100vh;
    }
    
    .amplify-authenticator {
      --amplify-colors-background-primary: transparent !important;
      --amplify-colors-background-secondary: #ffffff !important;
      --amplify-colors-font-primary: #1a202c !important;
      --amplify-colors-font-secondary: #4a5568 !important;
      --amplify-colors-brand-primary-60: #667eea !important;
      --amplify-colors-brand-primary-80: #5a67d8 !important;
      --amplify-colors-brand-primary-100: #4c51bf !important;
      background: transparent !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    
    .amplify-authenticator [data-amplify-authenticator] {
      background: transparent !important;
    }
    
    /* Beautiful card with glass effect */
    .amplify-card {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 20px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 15px 25px rgba(0, 0, 0, 0.05) !important;
      padding: 2rem !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-card:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 20px 30px rgba(0, 0, 0, 0.08) !important;
    }
    
    /* Beautiful primary button with gradient */
    .amplify-button[data-variation="primary"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      color: #ffffff !important;
      font-weight: 600 !important;
      padding: 0.75rem 1.5rem !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
    }
    
    .amplify-button[data-variation="primary"]:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6) !important;
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
    }
    
    /* Beautiful input fields */
    .amplify-input {
      background: rgba(255, 255, 255, 0.8) !important;
      border: 2px solid rgba(102, 126, 234, 0.1) !important;
      border-radius: 12px !important;
      color: #1a202c !important;
      font-size: 1rem !important;
      padding: 0.75rem 1rem !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      background: rgba(255, 255, 255, 1) !important;
      transform: translateY(-1px) !important;
    }
    
    .amplify-input:hover {
      border-color: rgba(102, 126, 234, 0.2) !important;
    }
    
    /* Beautiful labels */
    .amplify-field-group__field-label {
      color: #2d3748 !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      margin-bottom: 0.5rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
    }
    
    /* Beautiful tabs */
    .amplify-tabs {
      border: none !important;
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 15px !important;
      padding: 0.25rem !important;
      margin-bottom: 2rem !important;
    }
    
    .amplify-tabs-item {
      color: #4a5568 !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-tabs-item:hover {
      background: rgba(255, 255, 255, 0.5) !important;
      color: #2d3748 !important;
    }
    
    .amplify-tabs-item[data-state="active"] {
      background: rgba(255, 255, 255, 0.9) !important;
      color: #667eea !important;
      border: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      font-weight: 600 !important;
    }
    
    /* Beautiful link buttons */
    .amplify-button[data-variation="link"] {
      color: #667eea !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-button[data-variation="link"]:hover {
      color: #5a67d8 !important;
      transform: translateY(-1px) !important;
    }
    
    /* Error states */
    .amplify-field-group--error .amplify-input {
      border-color: #e53e3e !important;
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
    }
    
    /* Success states */
    .amplify-field-group--valid .amplify-input {
      border-color: #38a169 !important;
      box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1) !important;
    }
    
    /* Loading states */
    .amplify-button[data-variation="primary"]:disabled {
      background: linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%) !important;
      cursor: not-allowed !important;
      transform: none !important;
      box-shadow: none !important;
    }
    
    /* Smooth animations */
    .amplify-authenticator * {
      transition: all 0.3s ease !important;
    }
  `;

  const components = {
    Header() {
      return (
        <View textAlign="center" padding="3rem 0 2rem 0" backgroundColor="transparent">
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>
            🤖
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '2rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '0.5rem'
          }}>
            Rag n React
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            fontWeight: '400',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            Powered by Amazon Nova Micro ✨
          </div>
        </View>
      );
    },

    Footer() {
      return (
        <View textAlign="center" padding="2rem 0 1rem 0" backgroundColor="transparent">
          <div style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            fontWeight: '400',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            © 2025 Rag n React. Crafted with ❤️
          </div>
        </View>
      );
    },

    SignIn: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Welcome back
          </Heading>
        );
      },
      Footer() {
        const { toForgotPassword } = useAuthenticator();
        return (
          <View textAlign="center" marginTop="1rem">
            <Button
              fontWeight="normal"
              onClick={toForgotPassword}
              size="small"
              variation="link"
              color="#3b82f6"
            >
              Forgot your password?
            </Button>
          </View>
        );
      },
    },

    SignUp: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Create your account
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
        return (
          <View textAlign="center" marginTop="1rem">
            <Button
              fontWeight="normal"
              onClick={toSignIn}
              size="small"
              variation="link"
              color="#3b82f6"
            >
              Already have an account? Sign in
            </Button>
          </View>
        );
      },
    },

    ForgotPassword: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Reset your password
          </Heading>
        );
      },
    },

    ConfirmResetPassword: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Enter new password
          </Heading>
        );
      },
    },
  };

  const formFields = {
    signIn: {
      username: {
        placeholder: 'Enter your email',
      },
    },
    signUp: {
      password: {
        label: 'Password',
        placeholder: 'Enter your password',
      },
      confirm_password: {
        label: 'Confirm Password',
        placeholder: 'Confirm your password',
      },
    },
    forgotPassword: {
      username: {
        placeholder: 'Enter your email',
      },
    },
    confirmResetPassword: {
      confirmation_code: {
        placeholder: 'Enter confirmation code',
        label: 'Confirmation Code',
      },
      confirm_password: {
        placeholder: 'Enter your new password',
        label: 'New Password',
      },
    },
  };

  // Simple body background override
  React.useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f8fafc';
    
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: authenticatorStyles }} />
      <Authenticator variation="modal" components={components} formFields={formFields}>
      {({ signOut, user }) => (
        <main>
          {/* Auth Header */}
          <div style={{
            background: '#ffffff',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '1rem',
              color: '#3b82f6',
              fontWeight: '500'
            }}>
              Hello {user?.username}
            </h1>
            <button
              onClick={signOut}
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
          <ChatBot />
        </main>
      )}
      </Authenticator>
    </>
  );
}
