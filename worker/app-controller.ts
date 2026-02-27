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
      { category: 'Strategic', human: 75, ai: 25 }
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
      if (this.sessions.size === 0) {
        await this.seedMockData();
      }
      this.loaded = true;
    }
  }
  private async seedMockData(): Promise<void> {
    const tiers = [
      { name: 'Enterprise', ltv: 15000, prob: 0.2 },
      { name: 'Pro', ltv: 2000, prob: 0.5 },
      { name: 'Free', ltv: 0, prob: 0.3 }
    ];
    for (let i = 0; i < 20; i++) {
      const sessionId = crypto.randomUUID();
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      const startSent = 20 + Math.random() * 50;
      const endSent = Math.min(100, startSent + (Math.random() * 40));
      const isRedline = startSent < 40;
      const humanEdited = isRedline || Math.random() > 0.6;
      const metrics: SessionMetrics = {
        initialSentiment: Math.round(startSent),
        finalSentiment: Math.round(endSent),
        humanEditsCount: humanEdited ? Math.floor(Math.random() * 5) + 1 : 0,
        complexityScore: 70 + Math.random() * 30,
        humanValueScore: humanEdited ? (Math.random() * 100) + 50 : 10,
        isChurnRisk: isRedline,
        wasHumanEdited: humanEdited
      };
      this.sessions.set(sessionId, {
        id: sessionId,
        title: `Strategic Sync #${1000 + i}`,
        createdAt: Date.now() - (i * 3600000),
        lastActive: Date.now() - (i * 1800000),
        status: 'resolved',
        metrics
      });
      this.globalAnalytics.totalSessions++;
      if (humanEdited) {
        this.globalAnalytics.safetyNet.humanInterventions++;
        this.globalAnalytics.totalHumanValue += metrics.humanValueScore;
      } else {
        this.globalAnalytics.safetyNet.autoApprovals++;
      }
      if (isRedline && (endSent - startSent) > 15) {
        this.globalAnalytics.churnRevenueSaved += tier.ltv;
      }
      this.globalAnalytics.empathyTrend.push({
        session: `#${1000 + i}`,
        start: Math.round(startSent),
        end: Math.round(endSent)
      });
    }
    this.globalAnalytics.avgEmpathyDelta = 28.4;
    await this.persist();
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
      // Division safety check
      if (count > 0) {
        const prevAvg = this.globalAnalytics.avgEmpathyDelta || 0;
        this.globalAnalytics.avgEmpathyDelta = ((prevAvg * (count - 1)) + delta) / count;
      } else {
        this.globalAnalytics.avgEmpathyDelta = delta;
      }
      this.globalAnalytics.totalHumanValue += (metrics.humanValueScore || 0);
      if (metrics.initialSentiment < 40 && delta > 15) {
        this.globalAnalytics.churnRevenueSaved += 15000;
      }
      if (metrics.wasHumanEdited) {
        this.globalAnalytics.safetyNet.humanInterventions++;
      } else {
        this.globalAnalytics.safetyNet.autoApprovals++;
      }
      this.globalAnalytics.empathyTrend.push({
        session: session.title.slice(-5),
        start: metrics.initialSentiment,
        end: metrics.finalSentiment
      });
      if (this.globalAnalytics.empathyTrend.length > 30) this.globalAnalytics.empathyTrend.shift();
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
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    this.globalAnalytics = {
      totalSessions: 0,
      totalHumanValue: 0,
      avgEmpathyDelta: 0,
      aiAutomationRate: 68,
      churnRevenueSaved: 0,
      safetyNet: { humanInterventions: 0, autoApprovals: 0 },
      contributionData: this.globalAnalytics.contributionData,
      sentimentHistory: [],
      empathyTrend: []
    };
    await this.persist();
    return count;
  }
}