import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, SessionMetrics, AnalyticsSummary } from './types';
import type { Env } from './core-utils';
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private globalAnalytics: AnalyticsSummary = {
    totalSessions: 0,
    totalHumanValue: 0,
    avgEmpathyDelta: 0,
    aiAutomationRate: 68,
    churnRevenueSaved: 0,
    safetyNet: {
      humanInterventions: 0,
      autoApprovals: 0
    },
    contributionData: [
      { category: 'Technical', human: 20, ai: 80 },
      { category: 'Emotional', human: 95, ai: 5 },
      { category: 'Strategic', human: 75, ai: 25 },
      { category: 'Logistics', human: 90, ai: 10 }
    ],
    sentimentHistory: [],
    empathyTrend: []
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
      if (storedAnalytics) {
        this.globalAnalytics = storedAnalytics;
      }
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
      title: title || `Transmission ${new Date(now).toLocaleTimeString()}`,
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
      const resolvedSessions = Array.from(this.sessions.values()).filter(s => s.status === 'resolved');
      const count = resolvedSessions.length;
      if (count > 0) {
        const prevAvg = this.globalAnalytics.avgEmpathyDelta || 0;
        this.globalAnalytics.avgEmpathyDelta = ((prevAvg * (count - 1)) + delta) / count;
      } else {
        this.globalAnalytics.avgEmpathyDelta = delta;
      }
      this.globalAnalytics.totalHumanValue += (metrics.humanValueScore || 0);
      // Bonus Churn Recovery for High-Value Logistics Success
      if (metrics.churnRecoveryLtv) {
        this.globalAnalytics.churnRevenueSaved += metrics.churnRecoveryLtv;
      } else if (metrics.initialSentiment < 40 && delta > 15) {
        this.globalAnalytics.churnRevenueSaved += 15000;
      }
      if (metrics.wasHumanEdited || metrics.isCrisisResolved) {
        this.globalAnalytics.safetyNet.humanInterventions++;
      } else {
        this.globalAnalytics.safetyNet.autoApprovals++;
      }
      this.globalAnalytics.empathyTrend.push({
        session: session.title.slice(-5),
        start: metrics.initialSentiment,
        end: metrics.finalSentiment
      });
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.globalAnalytics.sentimentHistory.push({ time: timeStr, score: metrics.finalSentiment });
      await this.persist();
      return true;
    }
    return false;
  }
  async getGlobalAnalytics(): Promise<AnalyticsSummary> {
    await this.ensureLoaded();
    return this.globalAnalytics;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
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
}