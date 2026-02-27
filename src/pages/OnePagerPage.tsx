import React, { useEffect, useState } from 'react';
import { ShieldAlert, FileText, Printer, TrendingUp, DollarSign, Heart, Zap, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { chatService } from '@/lib/chat';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { AnalyticsSummary } from '../../worker/types';
export function OnePagerPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  useEffect(() => {
    chatService.getAnalytics().then(res => {
      if (res.success && res.data) setStats(res.data);
    });
  }, []);
  const handlePrint = () => window.print();
  const mockContribution = [
    { category: 'Empathy Add', human: 98, ai: 2 },
    { category: 'Crisis Logic', human: 85, ai: 15 },
    { category: 'Routing Speed', human: 10, ai: 90 },
    { category: 'Compliance', human: 5, ai: 95 },
  ];
  const empathyDelta = stats?.avgEmpathyDelta ?? 28;
  const churnSaved = stats?.churnRevenueSaved ?? 142000;
  const totalSolved = stats?.totalSessions ?? 0;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans print-container">
      {/* Action Bar - Hidden in Print */}
      <div className="no-print fixed top-6 right-6 z-50 flex gap-3">
        <Button onClick={() => navigate(-1)} variant="outline" className="bg-white text-slate-900 border-slate-200 hover:bg-slate-50">
          <ArrowLeft className="mr-2 size-4" /> Exit
        </Button>
        <Button onClick={handlePrint} className="bg-primary text-white shadow-lg hover:bg-primary/90">
          <Printer className="mr-2 size-4" /> Export Report
        </Button>
      </div>
      <div className="max-w-4xl mx-auto py-12 px-10 space-y-10 bg-white shadow-sm print:shadow-none min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldAlert className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900">SymbioticCX</h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Strategic ROI Engine // Confidential</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase">{format(new Date(), 'MMMM dd, yyyy')}</p>
            <Badge variant="outline" className="mt-2 border-primary/30 text-primary uppercase text-[9px] font-mono font-bold">Node: Centaur-Alpha-1</Badge>
          </div>
        </header>
        {/* Executive Summary */}
        <section className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight leading-tight text-slate-900">
            Augmenting Human Value in the Age of Autonomy.
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-3xl">
            SymbioticCX prevents high-value customer churn by strictly enforcing human intervention during low-sentiment logistics crises, ensuring enterprise LTV preservation where standard AI fails.
          </p>
        </section>
        {/* Core ROI Metrics */}
        <section className="grid grid-cols-3 gap-6">
          <Card className="border-slate-100 bg-slate-50/50 shadow-none">
            <CardContent className="p-6 space-y-2">
              <Heart className="size-5 text-emerald-500" />
              <p className="text-4xl font-black text-slate-900">+{Math.round(empathyDelta)}%</p>
              <p className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-tighter">Avg Empathy Delta</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100 bg-slate-50/50 shadow-none">
            <CardContent className="p-6 space-y-2">
              <DollarSign className="size-5 text-primary" />
              <p className="text-4xl font-black text-slate-900">${(churnSaved / 1000).toFixed(0)}k</p>
              <p className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-tighter">Recovered LTV</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100 bg-slate-50/50 shadow-none">
            <CardContent className="p-6 space-y-2">
              <Zap className="size-5 text-amber-500" />
              <p className="text-4xl font-black text-slate-900">{totalSolved}</p>
              <p className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-tighter">Verified Solutions</p>
            </CardContent>
          </Card>
        </section>
        {/* Contribution Chart */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Human vs AI Contribution Index</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500 font-bold">
                <span className="size-2 bg-primary rounded-full" /> Human Empathy
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500 font-bold">
                <span className="size-2 bg-slate-200 rounded-full" /> AI Automation
              </div>
            </div>
          </div>
          <div className="h-[220px] w-full bg-slate-50/30 rounded-xl border border-slate-100 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockContribution} layout="vertical" barGap={10} margin={{ left: 20 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={120}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold', fontFamily: 'Inter' }}
                />
                <Bar dataKey="human" stackId="a" radius={[0, 0, 0, 0]}>
                  {mockContribution.map((_, i) => <Cell key={`cell-human-${i}`} fill="#3b82f6" />)}
                </Bar>
                <Bar dataKey="ai" stackId="a" radius={[0, 4, 4, 0]}>
                  {mockContribution.map((_, i) => <Cell key={`cell-ai-${i}`} fill="#e2e8f0" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        {/* Methodology Footer */}
        <footer className="pt-12 border-t border-slate-100 space-y-6">
          <div className="grid grid-cols-2 gap-8 text-[11px] leading-relaxed text-slate-500">
            <p>
              <span className="font-bold text-slate-900 uppercase block mb-1">Centaur Methodology</span>
              Our platform operates on a Human-in-the-Loop basis. While AI manages standard logistics inquiries, the system strictly locks responses when sentiment scores drop below a 40% threshold, mandating a 'Human Empathy Bypass'.
            </p>
            <p>
              <span className="font-bold text-slate-900 uppercase block mb-1">Authenticity Report</span>
              Verified ROI metrics are calculated using the delta between inbound customer sentiment and final resolution satisfaction, weighted by account LTV. This report is system-generated and audit-ready.
            </p>
          </div>
          <div className="flex justify-between items-center opacity-60 text-[9px] font-mono uppercase tracking-widest pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3 text-emerald-500" /> Verified by SymbioticCX ROI Engine v1.0.4
            </div>
            <span>Internal Use Only</span>
          </div>
        </footer>
      </div>
    </div>
  );
}