import { http } from '@/src/lib/http';

export type Conversation = {
  _id: string;
  participants: Array<{ _id: string; name: string; email: string }>;
  lastMessage?: Message;
};

export type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export async function listConversations(): Promise<Conversation[]> {
  const { data } = await http.get<Conversation[]>('/api/conversations');
  return data;
}

export async function createConversation(participantId: string): Promise<Conversation> {
  const { data } = await http.post<Conversation>('/api/conversations', { participantId });
  return data;
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const { data } = await http.get<Message[]>(`/api/conversations/${conversationId}/messages`);
  return data;
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const { data } = await http.post<Message>('/api/messages', { conversationId, content });
  return data;
}


