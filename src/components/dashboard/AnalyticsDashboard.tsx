import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Brain, Heart, Zap, ShieldCheck } from 'lucide-react';
import { chatService } from '@/lib/chat';
import type { AnalyticsSummary } from '@/worker/types';
export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  useEffect(() => {
    const fetchStats = async () => {
      const res = await chatService.getAnalytics();
      if (res.success && res.data) setData(res.data);
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);
  if (!data) return <div className="h-96 flex items-center justify-center font-mono text-xs text-muted-foreground">SYNCING ROI CORE...</div>;
  const stats = [
    { label: 'Total Sessions', value: data.totalSessions.toLocaleString(), icon: Zap, delta: 'Live', color: 'text-primary' },
    { label: 'AI Shield Rate', value: `${data.aiAutomationRate}%`, icon: Brain, delta: 'Nominal', color: 'text-amber-500' },
    { label: 'Avg Empathy Delta', value: `+${Math.round(data.avgEmpathyDelta)}%`, icon: Heart, delta: 'Excellent', color: 'text-emerald-500' },
    { label: 'Human Value Index', value: data.totalHumanValue.toLocaleString(), icon: ShieldCheck, delta: 'ROI Positive', color: 'text-primary' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="cockpit-panel bg-black/40 border-white/5 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`size-4 ${stat.color}`} />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{stat.delta}</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-mono font-bold tracking-tighter">{stat.value}</p>
                <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none">
          <CardHeader><CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Contribution Matrix (Human vs AI)</CardTitle></CardHeader>
          <CardContent className="pb-6">
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.contributionData} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888', fontFamily: 'JetBrains Mono' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  <Bar dataKey="human" name="Human Empathy" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="ai" name="AI Utility" fill="rgba(255,255,255,0.1)" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none">
          <CardHeader><CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Live Sentiment Recovery Trend</CardTitle></CardHeader>
          <CardContent className="pb-6">
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.sentimentHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888', fontFamily: 'JetBrains Mono' }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}