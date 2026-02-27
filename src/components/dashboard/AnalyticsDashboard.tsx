import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Brain, Heart, Zap, ShieldCheck, TrendingUp, DollarSign } from 'lucide-react';
import { chatService } from '@/lib/chat';
import type { AnalyticsSummary } from '../../../worker/types';
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
  if (!data) return <div className="h-96 flex items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">SYNCHRONIZING ROI CORE...</div>;
  const stats = [
    { label: 'Total Sessions', value: data.totalSessions.toLocaleString(), icon: Zap, delta: 'Live', color: 'text-primary' },
    { label: 'Avg Empathy Delta', value: `+${Math.round(data.avgEmpathyDelta)}%`, icon: Heart, delta: 'Excellent', color: 'text-emerald-500' },
    { label: 'Churn Revenue Saved', value: `$${(data.churnRevenueSaved / 1000).toFixed(0)}k`, icon: DollarSign, delta: 'ROI Positive', color: 'text-primary' },
    { label: 'Human Value Index', value: data.totalHumanValue.toLocaleString(), icon: ShieldCheck, delta: 'High Impact', color: 'text-primary' },
  ];
  const safetyNetData = [
    { name: 'Human Intervention', value: data.safetyNet.humanInterventions, color: '#3b82f6' },
    { name: 'AI Auto-Approve', value: data.safetyNet.autoApprovals, color: 'rgba(255,255,255,0.1)' }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="cockpit-panel bg-black/40 border-white/5 shadow-none overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="size-24" />
              </div>
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
          <CardHeader>
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" /> AI Safety Net Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="w-full h-[320px] relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                <PieChart>
                  <Pie
                    data={safetyNetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {safetyNetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
                <span className="text-2xl font-mono font-bold">{Math.round((data.safetyNet.humanInterventions / data.totalSessions) * 100)}%</span>
                <span className="text-[8px] font-mono uppercase text-muted-foreground">Human Gate</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none">
          <CardHeader>
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" /> Empathy Delta Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="w-full h-[320px] relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                <LineChart data={data.empathyTrend.slice(-15)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#888', fontFamily: 'JetBrains Mono' }} />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="start" name="Inbound Sentiment" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="end" name="Resolved Sentiment" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}