import { useState } from 'react';
import { THEME_COLORS } from '../../constants';

interface ReasoningDisplayProps {
  reasoning: string;
}

export function ReasoningDisplay({ reasoning }: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Split reasoning into steps for better formatting
  const reasoningSteps = reasoning
    .split('\n')
    .filter(line => line.trim())
    .map((line, index) => ({
      id: index,
      content: line.trim()
    }));

  return (
    <div style={{
      margin: '0.75rem 0',
      background: `linear-gradient(135deg, ${THEME_COLORS.surface} 0%, ${THEME_COLORS.background} 100%)`,
      borderRadius: '12px',
      border: `1px solid ${THEME_COLORS.border}`,
      overflow: 'hidden',
      boxShadow: isHovered ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '1rem 1.25rem',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: THEME_COLORS.text,
          fontSize: '0.9rem',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          zIndex: 1,
        }}>
          <span style={{ 
            fontSize: '1.25rem',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }}>
            🧠
          </span>
          <span>Reasoning Process</span>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.125rem 0.5rem',
            backgroundColor: THEME_COLORS.primary + '20',
            color: THEME_COLORS.primary,
            borderRadius: '12px',
            fontWeight: '500',
          }}>
            {reasoningSteps.length} steps
          </span>
        </span>
        <span style={{ 
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '0.75rem',
          opacity: 0.7,
          zIndex: 1,
        }}>
          ▼
        </span>
        
        {/* Animated background gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, transparent 0%, ${THEME_COLORS.primary}10 50%, transparent 100%)`,
          transform: isHovered ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.5s ease',
        }} />
      </button>
      
      <div style={{
        maxHeight: isExpanded ? '800px' : '0',
        opacity: isExpanded ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '1.25rem',
          borderTop: `1px solid ${THEME_COLORS.border}`,
          backgroundColor: THEME_COLORS.background + '50',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {reasoningSteps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  opacity: 0,
                  transform: 'translateY(10px)',
                  animation: isExpanded ? `fadeInUp 0.4s ease ${index * 0.05}s forwards` : 'none',
                }}
              >
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '24px',
                  height: '24px',
                  backgroundColor: THEME_COLORS.primary + '20',
                  color: THEME_COLORS.primary,
                  borderRadius: '50%',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  flexShrink: 0,
                }}>
                  {index + 1}
                </span>
                <span style={{
                  color: THEME_COLORS.textSecondary,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  flex: 1,
                }}>
                  {step.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

// Alternative inline display for shorter reasoning
export function InlineReasoningDisplay({ reasoning }: { reasoning: string }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={{
      margin: '0.75rem 0',
      padding: '1rem 1.25rem',
      background: `linear-gradient(135deg, ${THEME_COLORS.surface} 0%, ${THEME_COLORS.background} 100%)`,
      borderLeft: `4px solid ${THEME_COLORS.primary}`,
      borderRadius: '8px',
      position: 'relative',
      animation: 'slideInLeft 0.4s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: THEME_COLORS.primary,
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <span style={{ fontSize: '1.125rem' }}>💭</span>
          <span>Quick Reasoning</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: THEME_COLORS.textSecondary,
            fontSize: '1.25rem',
            padding: '0.25rem',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = THEME_COLORS.surface;
            e.currentTarget.style.color = THEME_COLORS.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = THEME_COLORS.textSecondary;
          }}
        >
          ×
        </button>
      </div>
      <div style={{
        color: THEME_COLORS.textSecondary,
        fontSize: '0.875rem',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
      }}>
        {reasoning}
      </div>
      
      <style>
        {`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}