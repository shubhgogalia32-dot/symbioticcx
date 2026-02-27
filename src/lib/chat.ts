import type { Message, ChatState, ToolCall, WeatherResult, MCPResult, ErrorResult, SessionInfo, AnalyticsSummary, SessionMetrics } from '../../worker/types';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
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
      return await response.json();
    } catch (error) {
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