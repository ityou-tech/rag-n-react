export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: Array<{ text: string }>;
  createdAt: string;
}

export interface StreamEvent {
  text?: string;
  stopReason?: string;
  id?: string;
}

export interface ConversationStreamErrorEvent {
  [key: string]: any;
}