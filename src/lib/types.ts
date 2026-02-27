export interface AgentAnalysis {
  thought: string;
  draft: string;
  sentiment_score: number; // 0-100
  confidence_score: number; // 0-100
  suggested_actions: string[];
}
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  ltv: number;
  lastPurchase: string;
  avatarUrl?: string;
}
export interface SessionMetrics {
  humanValueScore: number;
  responseTime: number;
  sentimentTrend: number[];
}
export interface ExtendedMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  analysis?: AgentAnalysis;
  isDraft?: boolean;
  metadata?: {
    empathyDelta: number;
    humanEdited: boolean;
  };
}
export interface SessionSummary {
  sessionId: string;
  customer: CustomerProfile;
  lastMessage: string;
  sentiment: number;
  urgency: number;
  aiConfidence: number;
  isActive: boolean;
}
export interface AnalyticsData {
  totalSessions: number;
  aiAutomationRate: number;
  avgEmpathyDelta: number;
  humanValueScore: number;
  sentimentRecovery: { timestamp: string; score: number }[];
  contributionByCategory: { category: string; human: number; ai: number }[];
}