import React, { useState } from 'react';
import { useConversations } from '../../hooks/useConversations';
import { THEME_COLORS } from '../../constants';

interface ConversationSidebarProps {
  currentConversationId?: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onCreateAndSelect?: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ConversationSidebar({
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  onCreateAndSelect,
  isCollapsed = false,
  onToggleCollapse,
}: ConversationSidebarProps) {
  const {
    conversations,
    isLoading,
    hasMore,
    loadMore,
    createConversation,
    deleteConversation,
    updateConversation,
  } = useConversations();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleNewConversation = async () => {
    const newConversation = await createConversation();
    if (newConversation && onCreateAndSelect) {
      onCreateAndSelect(newConversation.id);
    } else if (newConversation) {
      onConversationSelect(newConversation.id);
    }
  };

  const handleRename = async (id: string) => {
    if (editName.trim()) {
      await updateConversation(id, { name: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(id);
      if (currentConversationId === id) {
        onNewConversation();
      }
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
    return date.toLocaleDateString();
  };

  const sidebarStyle: React.CSSProperties = {
    width: isCollapsed ? '60px' : '320px',
    height: '100vh',
    background: THEME_COLORS.surface,
    borderRight: `1px solid ${THEME_COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: '1rem',
    borderBottom: `1px solid ${THEME_COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'space-between',
  };

  const buttonStyle: React.CSSProperties = {
    background: THEME_COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: isCollapsed ? '0.5rem' : '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  if (isCollapsed) {
    return (
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              color: THEME_COLORS.text,
            }}
          >
            📝
          </button>
        </div>
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <button
            onClick={handleNewConversation}
            style={{
              ...buttonStyle,
              width: '40px',
              height: '40px',
              padding: '0',
              fontSize: '1.25rem',
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            📝
          </button>
          <span style={{ fontWeight: '600', color: THEME_COLORS.text }}>
            Conversations
          </span>
        </div>
        <button onClick={handleNewConversation} style={buttonStyle}>
          + New
        </button>
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
        {isLoading && conversations.length === 0 ? (
          <div style={{ 
            padding: '2rem 1rem', 
            textAlign: 'center', 
            color: THEME_COLORS.textSecondary 
          }}>
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ 
            padding: '2rem 1rem', 
            textAlign: 'center', 
            color: THEME_COLORS.textSecondary 
          }}>
            No conversations yet. Start a new one!
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              style={{
                padding: '0.75rem',
                margin: '0.25rem 0',
                borderRadius: '8px',
                cursor: 'pointer',
                background: currentConversationId === conversation.id 
                  ? THEME_COLORS.primary + '20' 
                  : 'transparent',
                border: currentConversationId === conversation.id
                  ? `1px solid ${THEME_COLORS.primary}`
                  : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onClick={() => onConversationSelect(conversation.id)}
              onMouseEnter={(e) => {
                if (currentConversationId !== conversation.id) {
                  e.currentTarget.style.background = THEME_COLORS.border;
                }
              }}
              onMouseLeave={(e) => {
                if (currentConversationId !== conversation.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === conversation.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRename(conversation.id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleRename(conversation.id);
                        }
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setEditName('');
                        }
                      }}
                      style={{
                        background: 'white',
                        border: `1px solid ${THEME_COLORS.primary}`,
                        borderRadius: '4px',
                        padding: '0.25rem',
                        fontSize: '0.875rem',
                        width: '100%',
                      }}
                      autoFocus
                    />
                  ) : (
                    <div
                      style={{
                        fontWeight: '500',
                        color: THEME_COLORS.text,
                        fontSize: '0.875rem',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conversation.name || 'Untitled'}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: THEME_COLORS.textSecondary,
                    }}
                  >
                    {formatRelativeTime(conversation.updatedAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(conversation.id, conversation.name || 'Untitled');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      opacity: 0.6,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.background = THEME_COLORS.border;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conversation.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      opacity: 0.6,
                      transition: 'opacity 0.2s ease',
                      color: '#dc2626',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.background = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Load More Button */}
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              margin: '0.5rem 0',
              background: 'none',
              border: `1px solid ${THEME_COLORS.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              color: THEME_COLORS.textSecondary,
              fontSize: '0.875rem',
            }}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
}