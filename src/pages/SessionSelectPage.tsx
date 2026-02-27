import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Search, SortAsc, Zap } from 'lucide-react';
import { chatService } from '@/lib/chat';
import { cn } from '@/lib/utils';
import type { SessionInfo } from '../../worker/types';
export function SessionSelectPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'urgency' | 'tier'>('urgency');
  useEffect(() => {
    chatService.listSessions().then(res => {
      if (res.success && res.data) setSessions(res.data);
    });
  }, []);
  const filteredSessions = sessions
    .filter(s => s.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => (sortBy === 'urgency' ? b.lastActive - a.lastActive : 0));
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Transmission Queue</h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">Centaur Triage // {sessions.length} Active Nodes</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search Transmissions..." className="pl-10 bg-white/5 border-white/10" value={filter} onChange={e => setFilter(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" onClick={() => setSortBy(sortBy === 'urgency' ? 'tier' : 'urgency')} className="font-mono text-[10px] uppercase">
                <SortAsc className="size-4 mr-2" /> Sort: {sortBy}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className={cn("cockpit-panel bg-black/40 border-white/5 hover:border-primary/40 transition-all duration-300", session.status === 'queued' && "border-amber-500/20")}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="size-10 rounded bg-white/5 flex items-center justify-center border border-white/5">
                        <User className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base truncate max-w-[140px]">{session.title}</CardTitle>
                        <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary h-4">ENTERPRISE</Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-mono">
                      {session.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase">Human Value Forecast</p>
                      <p className="text-sm font-bold text-primary flex items-center gap-2">
                        <Zap className="size-3" /> High ROI (+42%)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase">Risk Level</p>
                      <p className="text-sm font-bold text-amber-500">MODERATE</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-white/5 hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase" variant="outline" onClick={() => navigate(`/cockpit/${session.id}`)}>
                    Launch Cockpit Gate
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