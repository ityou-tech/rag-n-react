import React from 'react';
import { THEME_COLORS } from '../constants';

interface MessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export default function MessageInput({ 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  onKeyPress, 
  isLoading 
}: MessageInputProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      background: THEME_COLORS.surface,
      border: `1px solid ${THEME_COLORS.border}`,
      borderRadius: '12px',
      padding: '0.75rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Type your message here..."
        disabled={isLoading}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          color: THEME_COLORS.text,
          fontSize: '1rem',
          outline: 'none'
        }}
      />
      <button
        onClick={onSendMessage}
        disabled={!inputValue.trim() || isLoading}
        style={{
          background: THEME_COLORS.primary,
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
            e.currentTarget.style.background = THEME_COLORS.primary;
          }
        }}
      >
        {isLoading ? '⏳' : '🚀'}
      </button>
    </div>
  );
}