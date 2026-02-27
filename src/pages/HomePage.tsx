import React from 'react';
import { AgentCockpit } from '@/components/dashboard/AgentCockpit';
import { Toaster } from '@/components/ui/sonner';
import { ShieldAlert, Info } from 'lucide-react';
export function HomePage() {
  return (
    <div className="w-full h-screen bg-[#09090b] overflow-hidden relative">
      <AgentCockpit />
      {/* Mandatory AI Disclosure & System Protocol Overlay */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl flex items-start gap-3 max-w-xs animate-in fade-in slide-in-from-left-4 duration-1000">
          <div className="size-8 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="size-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5">
              Protocol: Centaur-OS 
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </p>
            <p className="text-[9px] font-sans text-muted-foreground leading-relaxed">
              This system utilizes advanced AI synthesis for drafting. Please note that global request limits apply across all user instances during peak periods.
            </p>
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-primary/60 uppercase pt-1">
              <Info className="size-2.5" /> Secure Uplink Established
            </div>
          </div>
        </div>
      </div>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}