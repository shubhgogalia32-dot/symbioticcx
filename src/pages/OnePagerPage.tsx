import React from 'react';
import { ShieldAlert, FileText, Printer, TrendingUp, DollarSign, Heart, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
export function OnePagerPage() {
  const handlePrint = () => window.print();
  const mockContribution = [
    { category: 'Emotional Intelligence', human: 95, ai: 5 },
    { category: 'Crisis Resolution', human: 88, ai: 12 },
    { category: 'Logistics Logic', human: 20, ai: 80 },
    { category: 'Policy Adherence', human: 15, ai: 85 },
  ];
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans print-container">
      {/* Action Bar - Hidden in Print */}
      <div className="no-print fixed top-6 right-6 z-50 flex gap-3">
        <Button onClick={() => window.history.back()} variant="outline" className="bg-white text-slate-900 border-slate-200">
          Back to Dashboard
        </Button>
        <Button onClick={handlePrint} className="bg-primary text-white shadow-lg">
          <Printer className="mr-2 size-4" /> Export PDF Report
        </Button>
      </div>
      <div className="max-w-4xl mx-auto py-12 px-8 space-y-12">
        {/* Header */}
        <header className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
              <ShieldAlert className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">SymbioticCX</h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Executive ROI Summary // Confidental</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase">{format(new Date(), 'MMMM dd, yyyy')}</p>
            <Badge variant="outline" className="mt-2 border-primary/20 text-primary uppercase text-[9px] font-mono">Status: Strategic Alpha</Badge>
          </div>
        </header>
        {/* The Hook */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-5xl font-black tracking-tight leading-none text-slate-900">
            Stop Bots Burning LTV.
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            The Centaur OS Advantage: Human-in-the-Loop orchestration for high-stakes customer recovery.
          </p>
        </section>
        {/* Problem vs Solution */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
              <span className="size-2 bg-red-500 rounded-full animate-pulse" /> The Problem
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Autonomous AI fails in <span className="font-bold text-slate-900">high-emotion logistics crises</span>. Rigid logic triggers churn by offering generic solutions to frustrated enterprise clients, resulting in significant LTV leakage.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <span className="size-2 bg-emerald-500 rounded-full" /> The Solution
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              SymbioticCX intercepts failing AI drafts. Our <span className="font-bold text-slate-900">Centaur Workflow</span> enables humans to apply empathy overrides exactly when sentiment drops, preserving high-value accounts.
            </p>
          </div>
        </div>
        {/* Metrics Grid */}
        <section className="grid grid-cols-3 gap-6">
          <Card className="border-slate-100 shadow-sm bg-slate-50/50">
            <CardContent className="p-6 space-y-2">
              <Heart className="size-5 text-emerald-500" />
              <p className="text-3xl font-black text-slate-900">+28%</p>
              <p className="text-[10px] font-mono uppercase text-slate-500">Avg Empathy Delta</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm bg-slate-50/50">
            <CardContent className="p-6 space-y-2">
              <DollarSign className="size-5 text-primary" />
              <p className="text-3xl font-black text-slate-900">$142k</p>
              <p className="text-[10px] font-mono uppercase text-slate-500">Churn Revenue Saved</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm bg-slate-50/50">
            <CardContent className="p-6 space-y-2">
              <Zap className="size-5 text-amber-500" />
              <p className="text-3xl font-black text-slate-900">100%</p>
              <p className="text-[10px] font-mono uppercase text-slate-500">Safety Net Coverage</p>
            </CardContent>
          </Card>
        </section>
        {/* Visualization */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Contribution by Category (Human vs AI)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500">
                <span className="size-2 bg-primary rounded-full" /> Human Verified
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500">
                <span className="size-2 bg-slate-200 rounded-full" /> AI Automated
              </div>
            </div>
          </div>
          <div className="h-[250px] w-full bg-slate-50/50 rounded-xl border border-slate-100 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockContribution} layout="vertical" barGap={8}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={150} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
                />
                <Bar dataKey="human" stackId="a" radius={[0, 0, 0, 0]}>
                  {mockContribution.map((entry, index) => (
                    <Cell key={`cell-h-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
                <Bar dataKey="ai" stackId="a" radius={[0, 4, 4, 0]}>
                  {mockContribution.map((entry, index) => (
                    <Cell key={`cell-a-${index}`} fill="#e2e8f0" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        {/* Footer */}
        <footer className="pt-12 border-t border-slate-100 flex justify-between items-center opacity-60">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-[10px] font-mono uppercase">Verified by ROI Engine v1.0.4</span>
          </div>
          <span className="text-[10px] font-mono uppercase">Internal Strategic Asset // Do Not Distribute</span>
        </footer>
      </div>
    </div>
  );
}