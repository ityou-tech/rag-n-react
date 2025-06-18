import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

const client = generateClient<Schema>();

function App() {
  const [messages, setMessages] = useState<Array<Schema["Message"]["type"]>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    client.models.Message.observeQuery().subscribe({
      next: (data) => setMessages([...data.items].sort((a, b) => {
        const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return aTime - bTime;
      })),
    });
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      // Create user message
      await client.models.Message.create({
        content: userMessage,
        role: "user",
        timestamp: new Date().toISOString(),
      });

      // Simulate AI response (replace with actual AI integration)
      setTimeout(async () => {
        try {
          await client.models.Message.create({
            content: `Thanks for your message: "${userMessage}". I'm r2r.ai, your AI assistant! How can I help you today?`,
            role: "assistant",
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error creating AI response:', error);
          // Create error message for user
          try {
            await client.models.Message.create({
              content: "Sorry, I encountered an error processing your message. Please try again.",
              role: "assistant",
              timestamp: new Date().toISOString(),
            });
          } catch (innerError) {
            console.error('Error creating error message:', innerError);
          }
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Error creating user message:', error);
      setIsLoading(false);
      // You could add a toast notification here or set an error state
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="chat-container">
          <header className="chat-header">
            <div className="header-content">
              <h1 className="chat-title">
                <span className="logo">🤖</span>
                r2r.ai
              </h1>
              <button onClick={signOut} className="logout-btn">
                Logout
              </button>
            </div>
          </header>

          <main className="chat-main">
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <div className="welcome-icon">👋</div>
                  <h2>Welcome to r2r.ai!</h2>
                  <p>Hello {user?.username}, I'm your AI assistant. Ask me anything!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    <div className="message-avatar">
                      {message.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.content}</div>
                      <div className="message-time">
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Unknown time'}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="message ai-message">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="message-input"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="send-button"
                >
                  <span className="send-icon">🚀</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
