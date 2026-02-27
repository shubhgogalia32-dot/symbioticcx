import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, ShieldAlert, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function AnalyticsPage() {
  const navigate = useNavigate();
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print-container">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 no-print">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Executive ROI Engine</h1>
              </div>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                SymbioticCX Strategic Oversight // Human-in-the-Loop Performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 font-mono text-[10px]">
                ROI RATIO: 14.2x
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-mono text-[10px]">
                NODES: 50+ ACTIVE
              </Badge>
              <Button 
                size="sm" 
                className="font-mono text-[10px] uppercase bg-primary text-white"
                onClick={() => navigate('/onepager')}
              >
                <FileDown className="mr-2 size-3" /> Export Executive One-Pager
              </Button>
            </div>
          </div>
          <AnalyticsDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 cockpit-panel bg-black/40 border-white/5 shadow-none">
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" /> Revenue Recovery Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: '7821', tier: 'Enterprise', impact: '$15,000', delta: '+42%', user: 'Rivera-01' },
                    { id: '7944', tier: 'Enterprise', impact: '$15,000', delta: '+38%', user: 'Rivera-01' },
                    { id: '8102', tier: 'Pro', impact: '$2,000', delta: '+55%', user: 'Kowalski-04' }
                  ].map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded bg-emerald-500/20 flex flex-col items-center justify-center text-emerald-500 font-bold font-mono">
                          <span className="text-[8px] leading-none opacity-60">DELTA</span>
                          <span className="text-sm">{log.delta}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Critical Churn Prevention #{log.id}</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase">
                            Tier: <span className="text-primary">{log.tier}</span> // Op: {log.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white font-mono">{log.impact}</p>
                        <p className="text-[9px] font-mono text-muted-foreground uppercase">LTV SAVED</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none">
                <CardHeader>
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" /> Strategic Delta
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="text-6xl font-mono font-black text-primary tracking-tighter">+28%</div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Avg Human Value Add</p>
                    <p className="text-[10px] font-mono text-emerald-500/80 mt-1">↑ 4.2% VS PREVIOUS CYCLE</p>
                  </div>
                </CardContent>
              </Card>
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-2 font-bold">System Status Note</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  * ROI calculations based on realized churn prevention metrics. Although this project features high-scale AI capabilities, session throughput is subject to global AI resource quotas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}