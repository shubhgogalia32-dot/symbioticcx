import type { Message, ChatState, SessionInfo, AnalyticsSummary, SessionMetrics } from '../../worker/types';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
export const MODELS = [
  { id: 'google-ai-studio/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }
];
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor() {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  async sendMessage(message: string, model?: string, onChunk?: (chunk: string) => void): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, stream: !!onChunk }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) onChunk(chunk);
          }
        } finally { reader.releaseLock(); }
        return { success: true };
      }
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to send' };
    }
  }
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to load' };
    }
  }
  async getAnalytics(): Promise<{ success: boolean; data?: AnalyticsSummary }> {
    try {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.error('Analytics Fetch Error:', error);
      return { success: false };
    }
  }
  async resolveSession(sessionId: string, metrics: SessionMetrics): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  }
  switchSession(sessionId: string): void {
    this.sessionId = sessionId;
    this.baseUrl = `/api/chat/${sessionId}`;
  }
  async listSessions(): Promise<{ success: boolean; data?: SessionInfo[] }> {
    try {
      const response = await fetch('/api/sessions');
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  }
}
export const chatService = new ChatService();