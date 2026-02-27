import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, SessionMetrics, AnalyticsSummary } from './types';
import type { Env } from './core-utils';
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private globalAnalytics: AnalyticsSummary = {
    totalSessions: 0,
    totalHumanValue: 0,
    avgEmpathyDelta: 0,
    aiAutomationRate: 65,
    contributionData: [
      { category: 'Technical', human: 20, ai: 80 },
      { category: 'Emotional', human: 90, ai: 10 },
      { category: 'Strategic', human: 70, ai: 30 }
    ],
    sentimentHistory: []
  };
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const storedSessions = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      const storedAnalytics = await this.ctx.storage.get<AnalyticsSummary>('globalAnalytics');
      this.sessions = new Map(Object.entries(storedSessions));
      if (storedAnalytics) this.globalAnalytics = storedAnalytics;
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
    await this.ctx.storage.put('globalAnalytics', this.globalAnalytics);
  }
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now,
      status: 'queued'
    });
    this.globalAnalytics.totalSessions++;
    await this.persist();
  }
  async resolveSession(sessionId: string, metrics: SessionMetrics): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'resolved';
      session.metrics = metrics;
      const delta = metrics.finalSentiment - metrics.initialSentiment;
      const count = Array.from(this.sessions.values()).filter(s => s.status === 'resolved').length;
      this.globalAnalytics.avgEmpathyDelta = ((this.globalAnalytics.avgEmpathyDelta * (count - 1)) + delta) / count;
      this.globalAnalytics.totalHumanValue += metrics.humanValueScore;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.globalAnalytics.sentimentHistory.push({ time: timeStr, score: metrics.finalSentiment });
      if (this.globalAnalytics.sentimentHistory.length > 20) this.globalAnalytics.sentimentHistory.shift();
      await this.persist();
      return true;
    }
    return false;
  }
  async getGlobalAnalytics(): Promise<AnalyticsSummary> {
    await this.ensureLoaded();
    return this.globalAnalytics;
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      if (session.status === 'queued') session.status = 'active';
      await this.persist();
    }
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    this.globalAnalytics.totalSessions = 0;
    this.globalAnalytics.totalHumanValue = 0;
    await this.persist();
    return count;
  }
}