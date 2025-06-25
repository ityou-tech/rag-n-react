import React, { useState, useEffect, useRef } from 'react';
import { client } from '../client';
import { Message } from '../types';
import { MESSAGE_IDS, THEME_COLORS } from '../constants';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatBot() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<any>(null);

  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      console.log('Creating conversation...');
      const { data: conversation } = await client.conversations.chat.create();
      conversationRef.current = conversation;

      if (conversation) {
        conversation.onStreamEvent({
          next: (event: any) => {
            console.log('Stream event:', event);
            
            if (event.text) {
              setMessages(prev => {
                const filtered = prev.filter(m => m.id !== MESSAGE_IDS.TEMP_AI);
                const existingAiIndex = filtered.findIndex(m =>
                  m.role === 'assistant' && m.id === MESSAGE_IDS.STREAMING_AI
                );
                
                if (existingAiIndex >= 0) {
                  const updated = [...filtered];
                  updated[existingAiIndex] = {
                    ...updated[existingAiIndex],
                    content: [{
                      text: updated[existingAiIndex].content[0].text + event.text
                    }]
                  };
                  return updated;
                } else {
                  const aiMessage: Message = {
                    id: MESSAGE_IDS.STREAMING_AI,
                    role: 'assistant',
                    content: [{ text: event.text }],
                    createdAt: new Date().toISOString()
                  };
                  return [...filtered, aiMessage];
                }
              });
            }
            
            if (event.stopReason || event.id?.includes('#complete')) {
              setIsLoading(false);
              setMessages(prev =>
                prev.map(m =>
                  m.id === MESSAGE_IDS.STREAMING_AI
                    ? { ...m, id: `ai-${Date.now()}` }
                    : m
                )
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

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: [{ text: messageText }],
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    const tempAiMessage: Message = {
      id: MESSAGE_IDS.TEMP_AI,
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
      setMessages(prev => prev.filter(m => m.id !== MESSAGE_IDS.TEMP_AI));
      setInputValue(messageText);
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
      backgroundColor: THEME_COLORS.background,
      color: THEME_COLORS.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
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
          <MessageList messages={messages} />
        </div>

        {/* Input */}
        <MessageInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={sendMessage}
          onKeyPress={handleKeyPress}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}