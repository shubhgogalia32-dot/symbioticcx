import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { User, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CustomerProfile } from '@/lib/types';
interface IntelligencePanelProps {
  profile: CustomerProfile;
  sentiment: number;
  confidence: number;
}
export function IntelligencePanel({ profile, sentiment, confidence }: IntelligencePanelProps) {
  const data = [{ value: sentiment, fill: sentiment < 40 ? '#ef4444' : sentiment < 70 ? '#f59e0b' : '#10b981' }];
  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="cockpit-panel border-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
            <User className="size-3" /> Customer Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
              {profile.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono">
            <div className="bg-white/5 p-2 rounded border border-white/10">
              <p className="text-[10px] text-muted-foreground uppercase">Tier</p>
              <Badge variant="outline" className="mt-1 border-primary/50 text-primary">{profile.tier}</Badge>
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/10">
              <p className="text-[10px] text-muted-foreground uppercase">LTV</p>
              <p className="font-bold text-green-500">${profile.ltv.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="cockpit-panel flex-1 border-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
            <TrendingUp className="size-3" /> Empathy Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
            <div className="size-48 relative">
              <RadialBarChart width={192} height={192} innerRadius="80%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} background fill={data[0].fill} />
              </RadialBarChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-4xl font-mono font-bold">{sentiment}%</span>
                <span className="text-[10px] uppercase text-muted-foreground">Sentiment</span>
              </div>
            </div>
          <div className="w-full space-y-4 mt-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck className="size-3" /> AI Confidence
                </span>
                <span className={confidence < 50 ? 'text-yellow-500' : 'text-green-500'}>{confidence}%</span>
              </div>
              <Progress value={confidence} className="h-1 bg-white/10" />
            </div>
            {sentiment < 40 && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 flex gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">High frustration detected. Auto-response locked. Human empathy required.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}