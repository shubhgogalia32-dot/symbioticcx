import React from 'react';
import { AgentCockpit } from '@/components/dashboard/AgentCockpit';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  return (
    <div className="w-full h-screen bg-[#09090b]">
      <AgentCockpit />
      <div className="fixed bottom-4 left-4 z-50 pointer-events-none opacity-40">
        <p className="text-[10px] font-mono text-white/50">
          SYMBOTIC-CX // HUMAN-IN-THE-LOOP OPS // LIMITS APPLY
        </p>
      </div>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}