import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp } from 'lucide-react';
export function AnalyticsPage() {
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Strategic Command</h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">
                Centaur Operations // Efficiency & Empathy Metrics
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                SYSTEM NOMINAL
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-mono">
                UPTIME: 99.98%
              </Badge>
            </div>
          </div>
          <AnalyticsDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 cockpit-panel bg-black/40 border-white/5 shadow-none">
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" /> Critical Intervention Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded bg-red-500/20 flex items-center justify-center text-red-500 font-bold font-mono">
                          {35 + i}%
                        </div>
                        <div>
                          <p className="text-sm font-medium">Session #782{i} - Escalation Prevented</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase">Agent: Rivera-01 // Empathy Delta: +42%</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono border-white/10 group-hover:border-primary/50">
                        REVIEWED
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none">
              <CardHeader>
                <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" /> Live Empathy Delta
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[240px] space-y-4">
                <div className="text-6xl font-mono font-black text-primary">+28%</div>
                <div className="text-center">
                  <p className="text-[10px] font-mono uppercase tracking-tighter text-muted-foreground">Average Human Value Add</p>
                  <p className="text-[10px] font-mono text-emerald-500/80 mt-1">↑ 4.2% vs Last 24h</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}