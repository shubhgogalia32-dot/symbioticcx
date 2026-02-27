import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, AlertCircle, ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionSummary } from '@/lib/types';
const MOCK_SESSIONS: SessionSummary[] = [
  {
    sessionId: '7821',
    customer: { id: 'c1', name: 'Alex Rivera', email: 'alex@ent.io', tier: 'Enterprise', ltv: 12450, lastPurchase: '' },
    lastMessage: "Where is my order? This is the third time...",
    sentiment: 32,
    urgency: 95,
    aiConfidence: 45,
    isActive: true
  },
  {
    sessionId: '7822',
    customer: { id: 'c2', name: 'Sarah Chen', email: 'sarah@cloud.com', tier: 'Pro', ltv: 3200, lastPurchase: '' },
    lastMessage: "How do I update my billing info?",
    sentiment: 68,
    urgency: 40,
    aiConfidence: 92,
    isActive: false
  },
  {
    sessionId: '7823',
    customer: { id: 'c3', name: 'James Wilson', email: 'j.wilson@corp.net', tier: 'Enterprise', ltv: 45000, lastPurchase: '' },
    lastMessage: "We need to discuss the bulk licensing...",
    sentiment: 85,
    urgency: 75,
    aiConfidence: 78,
    isActive: false
  }
];
export function SessionSelectPage() {
  const navigate = useNavigate();
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Active Transmissions</h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">
                Triage Queue // Prioritized by Urgency & Tier
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground">1 REDLINE ACTIVE</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SESSIONS.map((session) => (
              <Card 
                key={session.sessionId} 
                className={cn(
                  "cockpit-panel bg-black/40 border-white/5 transition-all duration-300 hover:border-primary/40",
                  session.sentiment < 40 ? "pulse-red border-red-500/20" : ""
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="size-10 rounded bg-white/5 flex items-center justify-center border border-white/5">
                        <User className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base truncate">{session.customer.name}</CardTitle>
                        <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary h-4">
                          {session.customer.tier}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase">Urgency</p>
                      <p className={cn("text-sm font-mono font-bold", session.urgency > 80 ? "text-red-500" : "text-foreground")}>
                        {session.urgency}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded bg-white/5 border border-white/5 min-h-[60px]">
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{session.lastMessage}"
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
                      <span className="text-muted-foreground">Current Sentiment</span>
                      <span className={session.sentiment < 40 ? "text-red-500" : "text-emerald-500"}>
                        {session.sentiment}%
                      </span>
                    </div>
                    <Progress value={session.sentiment} className="h-1 bg-white/5" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-white/5 border-white/10 hover:bg-primary hover:text-primary-foreground group transition-all duration-500 font-mono text-xs uppercase tracking-widest"
                    variant="outline"
                    onClick={() => navigate(`/cockpit/${session.sessionId}`)}
                  >
                    Launch Cockpit
                    <ChevronRight className="size-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}