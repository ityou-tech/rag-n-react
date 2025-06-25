import { useState, useEffect } from 'react';
import { client } from '../client';

// Use the conversation type from the client
type Conversation = Awaited<ReturnType<typeof client.conversations.chat.list>>['data'][0];

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | undefined>();

  const loadConversations = async (reset = false) => {
    setIsLoading(true);
    try {
      const result = await client.conversations.chat.list({
        limit: 25,
        nextToken: reset ? undefined : nextToken,
      });
      
      if (reset) {
        setConversations(result.data || []);
      } else {
        setConversations(prev => [...prev, ...(result.data || [])]);
      }
      setNextToken(result.nextToken || undefined);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
    setIsLoading(false);
  };

  const createConversation = async (name = 'New Conversation') => {
    try {
      const { data: conversation } = await client.conversations.chat.create({
        name,
        metadata: { createdVia: 'sidebar-new' },
      });
      
      if (conversation) {
        setConversations(prev => [conversation, ...prev]);
        return conversation;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
    return null;
  };

  const deleteConversation = async (id: string) => {
    try {
      await client.conversations.chat.delete({ id });
      setConversations(prev => prev.filter(conv => conv.id !== id));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const updateConversation = async (id: string, updates: Partial<Pick<Conversation, 'name' | 'metadata'>>) => {
    try {
      const { data: updated } = await client.conversations.chat.update({
        id,
        ...updates,
      });
      
      if (updated) {
        setConversations(prev => prev.map(conv => 
          conv.id === id ? { ...conv, ...updated } : conv
        ));
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  useEffect(() => {
    loadConversations(true);
  }, []);

  return {
    conversations,
    isLoading,
    hasMore: !!nextToken,
    loadMore: () => loadConversations(false),
    refresh: () => loadConversations(true),
    createConversation,
    deleteConversation,
    updateConversation,
  };
}