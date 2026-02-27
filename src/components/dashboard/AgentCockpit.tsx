import React, { useState, useEffect, useCallback } from 'react';
import { LiveTranscript } from './LiveTranscript';
import { IntelligencePanel } from './IntelligencePanel';
import { ControlDeck } from './ControlDeck';
import { AppLayout } from '@/components/layout/AppLayout';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
import type { ExtendedMessage, AgentAnalysis, CustomerProfile } from '@/lib/types';
const MOCK_CUSTOMER: CustomerProfile = {
  id: 'cust_7821',
  name: 'Alex Rivera',
  email: 'alex.rivera@enterprise.io',
  tier: 'Enterprise',
  ltv: 12450,
  lastPurchase: '2024-05-12'
};
export function AgentCockpit() {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AgentAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sentiment, setSentiment] = useState(72);
  const [confidence, setConfidence] = useState(95);
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    setIsProcessing(true);
    const newMessage: ExtendedMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentAnalysis(null);
    // In a real app, we'd persist this to the worker
    // For the demo, we'll just clear the processing state
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Response transmitted successfully");
    }, 600);
  };
  const handleReject = () => {
    setCurrentAnalysis(null);
    toast.info("Draft discarded");
  };
  // Simulate a customer message for the Centaur demo
  const simulateCustomerMessage = useCallback(async (text: string) => {
    setIsProcessing(true);
    const userMsg: ExtendedMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    try {
      const response = await chatService.sendMessage(text);
      if (response.success && response.data?.messages) {
        const lastMsg = response.data.messages[response.data.messages.length - 1];
        try {
          const analysis = JSON.parse(lastMsg.content) as AgentAnalysis;
          setCurrentAnalysis(analysis);
          setSentiment(analysis.sentiment_score);
          setConfidence(analysis.confidence_score);
        } catch (e) {
          console.error("AI failed to return JSON", lastMsg.content);
          toast.error("AI Protocol Error: Malformed response");
        }
      }
    } catch (err) {
      toast.error("Communication uplink failed");
    } finally {
      setIsProcessing(false);
    }
  }, []);
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className={cn(
        "flex h-screen w-full transition-colors duration-500",
        sentiment < 40 ? "border-4 border-red-500/20" : "border-none"
      )}>
        {/* Main Cockpit Stage */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
          <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <h1 className="font-mono text-sm uppercase tracking-widest font-bold">Session Active: {MOCK_CUSTOMER.id}</h1>
            </div>
            <button 
              onClick={() => simulateCustomerMessage("I'm really upset that my order hasn't arrived yet and nobody is helping me!")}
              className="text-[10px] font-mono bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 transition-colors"
            >
              Simulate Frustrated User
            </button>
          </header>
          <LiveTranscript messages={messages} />
          <ControlDeck 
            analysis={currentAnalysis} 
            onSend={handleSendMessage} 
            onReject={handleReject}
            isProcessing={isProcessing}
          />
        </div>
        {/* Intelligence Sidebar */}
        <aside className="w-80 bg-black/20 p-6 hidden lg:block">
          <IntelligencePanel 
            profile={MOCK_CUSTOMER} 
            sentiment={sentiment} 
            confidence={confidence} 
          />
        </aside>
      </div>
    </AppLayout>
  );
}
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}