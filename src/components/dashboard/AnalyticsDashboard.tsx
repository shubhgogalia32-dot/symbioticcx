import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Brain, Heart, Zap, ShieldCheck } from 'lucide-react';
const contributionData = [
  { category: 'Technical', human: 30, ai: 70 },
  { category: 'Emotional', human: 85, ai: 15 },
  { category: 'Logistical', human: 40, ai: 60 },
  { category: 'Strategic', human: 65, ai: 35 },
];
const recoveryData = [
  { time: '08:00', score: 45 },
  { time: '10:00', score: 52 },
  { time: '12:00', score: 48 },
  { time: '14:00', score: 75 },
  { time: '16:00', score: 82 },
  { time: '18:00', score: 79 },
];
export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: '1,284', icon: Zap, delta: '+12%', color: 'text-primary' },
          { label: 'AI Automation', value: '64.2%', icon: Brain, delta: '-2.1%', color: 'text-amber-500' },
          { label: 'Human Empathy Δ', value: '+38%', icon: Heart, delta: '+5.4%', color: 'text-emerald-500' },
          { label: 'Job Preservation', value: '98.2', icon: ShieldCheck, delta: 'Stable', color: 'text-primary' },
        ].map((stat, i) => (
          <Card key={i} className="cockpit-panel bg-black/40 border-white/5 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`size-4 ${stat.color}`} />
                <span className="text-[10px] font-mono text-muted-foreground">{stat.delta}</span>
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
        <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none h-[400px]">
          <CardHeader>
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Collaborative Contribution Matrix</CardTitle>
          </CardHeader>
          <CardContent className="h-full pb-12">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={contributionData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888', fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                <Bar dataKey="human" name="Human Value" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ai" name="AI Shield" fill="rgba(255,255,255,0.1)" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="cockpit-panel bg-black/40 border-white/5 shadow-none h-[400px]">
          <CardHeader>
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Aggregate Sentiment Recovery</CardTitle>
          </CardHeader>
          <CardContent className="h-full pb-12">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={recoveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888', fontFamily: 'JetBrains Mono' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}