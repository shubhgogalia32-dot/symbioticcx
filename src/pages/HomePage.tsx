import React from 'react';
import { AgentCockpit } from '@/components/dashboard/AgentCockpit';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  return (
    <div className="w-full h-screen bg-[#09090b] overflow-hidden relative">
      <AgentCockpit />
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}