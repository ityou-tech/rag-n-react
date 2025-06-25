import { useState, useEffect } from 'react';
import ConversationSidebar from './ConversationSidebar';
import ChatView from './ChatView';
import WelcomeScreen from './WelcomeScreen';
import { useConversations } from '../../hooks/useConversations';
import { THEME_COLORS } from '../../constants';

interface ConversationLayoutProps {
  initialConversationId?: string;
}

export default function ConversationLayout({ initialConversationId }: ConversationLayoutProps) {
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(initialConversationId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { conversations, createConversation } = useConversations();

  // Load the latest conversation on initial load
  useEffect(() => {
    if (!isInitialized && conversations.length > 0 && !initialConversationId) {
      // Load the most recent conversation (conversations are sorted by updatedAt desc)
      setCurrentConversationId(conversations[0].id);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Wait a bit to ensure conversations are loaded, then set initialized
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [conversations, initialConversationId, isInitialized]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleConversationSelect = (id: string) => {
    setCurrentConversationId(id);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(undefined);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleCreateAndSelectNewConversation = (id: string) => {
    setCurrentConversationId(id);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleCreateNewConversation = async () => {
    const newConversation = await createConversation();
    if (newConversation) {
      setCurrentConversationId(newConversation.id);
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: THEME_COLORS.background,
    }}>
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: isMobile ? 'fixed' : 'relative',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: isMobile ? 20 : 1,
          transform: isMobile && sidebarCollapsed ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        <ConversationSidebar
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onCreateAndSelect={handleCreateAndSelectNewConversation}
          isCollapsed={!isMobile && sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Chat Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginLeft: isMobile ? 0 : 0,
      }}>
        {/* Mobile Header */}
        {isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            background: THEME_COLORS.surface,
            borderBottom: `1px solid ${THEME_COLORS.border}`,
            gap: '1rem',
          }}>
            <button
              onClick={toggleSidebar}
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
            <h1 style={{
              margin: 0,
              color: THEME_COLORS.primary,
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              🤖 Rag-n-React
            </h1>
          </div>
        )}

        {/* Chat View */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {!isInitialized ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: THEME_COLORS.textSecondary
            }}>
              Loading conversations...
            </div>
          ) : currentConversationId ? (
            <ChatView
              key={currentConversationId}
              conversationId={currentConversationId}
              hideHeader={isMobile}
            />
          ) : (
            <WelcomeScreen onCreateConversation={handleCreateNewConversation} />
          )}
        </div>
      </div>
    </div>
  );
}