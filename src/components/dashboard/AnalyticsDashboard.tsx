import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, Zap, ShieldCheck, DollarSign, TrendingUp } from 'lucide-react';
import { chatService } from '@/lib/chat';
import type { AnalyticsSummary } from '../../../worker/types';
export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    const fetchStats = async () => {
      try {
        const res = await chatService.getAnalytics();
        if (res.success && res.data && isMounted.current) {
          setData(res.data);
        }
      } catch (e) {
        console.error("Analytics fetch failed", e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);
  if (!data) return (
    <div className="h-96 flex flex-col items-center justify-center font-mono text-xs text-muted-foreground gap-4">
      <div className="size-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
      SYNCHRONIZING ROI CORE...
    </div>
  );
  const stats = [
    { label: 'Total Sessions', value: data.totalSessions, icon: Zap, color: 'text-primary' },
    { label: 'Avg Empathy Delta', value: `+${Math.round(data.avgEmpathyDelta)}%`, icon: Heart, color: 'text-emerald-500' },
    { label: 'Churn Revenue Saved', value: `$${(data.churnRevenueSaved / 1000).toFixed(0)}k`, icon: DollarSign, color: 'text-primary' },
    { label: 'Human Value Index', value: data.totalHumanValue, icon: ShieldCheck, color: 'text-primary' },
  ];
  const safetyNetData = [
    { name: 'Human Verified', value: data.safetyNet.humanInterventions, color: '#3b82f6' },
    { name: 'AI Automated', value: data.safetyNet.autoApprovals, color: 'rgba(255,255,255,0.05)' }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="cockpit-panel bg-black/40 border-white/5 shadow-none group transition-all hover:bg-black/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`size-4 ${stat.color}`} />
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Live Feed</span>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-3 text-primary" /> Centaur Workflow Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] min-h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safetyNetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {safetyNetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', textTransform: 'uppercase' }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
                <span className="text-2xl font-mono font-bold">{Math.round((data.safetyNet.humanInterventions / Math.max(1, data.totalSessions)) * 100)}%</span>
                <span className="text-[8px] font-mono uppercase text-muted-foreground tracking-tighter">Human Gate</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="size-3 text-emerald-500" /> Sentiment Recovery Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.empathyTrend.slice(-10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="session" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fill: '#666', fontFamily: 'JetBrains Mono' }} 
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', paddingBottom: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="start" 
                    name="Inbound" 
                    stroke="#ef4444" 
                    strokeWidth={1} 
                    strokeDasharray="4 4" 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="end" 
                    name="Resolved" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}