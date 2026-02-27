import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { User, ShieldCheck, TrendingUp, AlertTriangle, Target, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CustomerProfile } from '@/lib/types';
interface IntelligencePanelProps {
  profile: CustomerProfile;
  sentiment: number;
  confidence: number;
}
export function IntelligencePanel({ profile, sentiment, confidence }: IntelligencePanelProps) {
  const isRedline = sentiment < 40;
  const getSentimentColor = (val: number) => {
    if (val < 40) return '#ef4444'; // Red
    if (val < 70) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };
  const sentimentData = [{ value: sentiment, fill: getSentimentColor(sentiment) }];
  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Profile Section */}
      <Card className="cockpit-panel border-none bg-black/40 shadow-none">
        <CardHeader className="pb-3 px-0">
          <CardTitle className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <User className="size-3" /> Identity Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-5">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-primary font-bold border border-white/10 text-xl shadow-inner">
              {profile.name[0]}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base leading-none">{profile.name}</h3>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">{profile.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <p className="text-[9px] text-muted-foreground uppercase font-mono">Service Tier</p>
              <Badge variant="outline" className="mt-1.5 border-primary/40 text-primary font-mono text-[9px] px-1.5 h-4">
                {profile.tier}
              </Badge>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <p className="text-[9px] text-muted-foreground uppercase font-mono">Account LTV</p>
              <p className="font-bold text-green-500 mt-1 font-mono">${profile.ltv.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Sentiment Section */}
      <Card className={cn(
        "cockpit-panel flex-1 border-none bg-black/40 shadow-none transition-all duration-500",
        isRedline ? "pulse-red" : ""
      )}>
        <CardHeader className="pb-0 px-0">
          <CardTitle className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <TrendingUp className="size-3" /> Empathy Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 flex flex-col items-center">
          <div className="size-56 relative mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="80%" outerRadius="100%" data={sentimentData} startAngle={225} endAngle={-45}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'rgba(255,255,255,0.05)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className={cn(
                "text-5xl font-mono font-black tracking-tighter",
                isRedline ? "text-red-500" : "text-foreground"
              )}>
                {sentiment}
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground mt-1">
                Sentiment Index
              </span>
            </div>
          </div>
          <div className="w-full space-y-5 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="size-3" /> AI Confidence
                </span>
                <span className={confidence < 60 ? 'text-amber-500' : 'text-green-500'}>{confidence}%</span>
              </div>
              <Progress 
                value={confidence} 
                className="h-1 bg-white/5" 
                // @ts-ignore - shadcn progress colors usually handled via div children but here we use utility
              />
            </div>
            {isRedline && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 animate-in zoom-in-95 duration-300">
                <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-red-400 uppercase font-mono">Redline Detected</p>
                  <p className="text-[10px] text-red-300/80 leading-relaxed font-sans">
                    Customer is exhibiting high frustration. Auto-approval disabled. Manual empathy intervention required.
                  </p>
                </div>
              </div>
            )}
            {!isRedline && sentiment > 70 && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
                <Target className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-emerald-400 uppercase font-mono">Positive Momentum</p>
                  <p className="text-[10px] text-emerald-300/80 leading-relaxed font-sans">
                    High engagement levels. Excellent opportunity for proactive upsell or loyalty reinforcement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-tighter">
          <Briefcase className="size-3" /> Operative: Centaur-01 // Link Stable
        </div>
      </div>
    </div>
  );
}