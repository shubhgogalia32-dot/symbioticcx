export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: string; }
export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}
export interface MCPResult {
  content: string;
}
export interface ErrorResult {
  error: string;
}
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  toolCalls?: ToolCall[];
}
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}
export interface ChatState {
  messages: Message[];
  sessionId: string;
  isProcessing: boolean;
  model: string;
  streamingMessage?: string;
}
export interface SessionMetrics {
  initialSentiment: number;
  finalSentiment: number;
  humanEditsCount: number;
  complexityScore: number;
  humanValueScore: number;
  isChurnRisk?: boolean;
  wasHumanEdited?: boolean;
  isCrisisResolved?: boolean;
  churnRecoveryLtv?: number;
}
export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
  status: 'queued' | 'active' | 'resolved';
  metrics?: SessionMetrics;
}
export interface AnalyticsSummary {
  totalSessions: number;
  totalHumanValue: number;
  avgEmpathyDelta: number;
  aiAutomationRate: number;
  churnRevenueSaved: number;
  safetyNet: {
    humanInterventions: number;
    autoApprovals: number;
  };
  contributionData: { category: string; human: number; ai: number }[];
  sentimentHistory: { time: string; score: number }[];
  empathyTrend: { session: string; start: number; end: number }[];
}
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}