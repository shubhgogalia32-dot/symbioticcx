import React, { useState, useCallback } from 'react';
import { LiveTranscript } from './LiveTranscript';
import { IntelligencePanel } from './IntelligencePanel';
import { ControlDeck } from './ControlDeck';
import { AppLayout } from '@/components/layout/AppLayout';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
    const newMessage: ExtendedMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentAnalysis(null);
    toast.success("Response verified and transmitted");
  };
  const handleReject = () => {
    setCurrentAnalysis(null);
    toast.info("Draft discarded by human agent");
  };
  const simulateCustomerMessage = useCallback(async (text: string) => {
    if (isProcessing) return;
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
      if (response.success) {
        // Fetch latest messages from the agent state
        const refreshResponse = await chatService.getMessages();
        if (refreshResponse.success && refreshResponse.data?.messages) {
          const lastMsg = refreshResponse.data.messages[refreshResponse.data.messages.length - 1];
          try {
            const analysis = JSON.parse(lastMsg.content) as AgentAnalysis;
            setCurrentAnalysis(analysis);
            setSentiment(analysis.sentiment_score);
            setConfidence(analysis.confidence_score);
            if (analysis.sentiment_score < 40) {
              toast.error("Critical Sentiment Drop Detected", {
                description: "Emotional Override active. Human empathy required."
              });
            }
          } catch (e) {
            console.error("AI Protocol Error: Malformed JSON", lastMsg.content);
            toast.error("AI Communication Error", { description: "Received non-structured response." });
          }
        }
      }
    } catch (err) {
      toast.error("Uplink Failure", { description: "Check connection to Intelligence Core." });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className={cn(
        "flex h-screen w-full transition-all duration-700",
        sentiment < 40 ? "ring-4 ring-inset ring-red-500/30" : ""
      )}>
        {/* Main Cockpit Stage */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 relative">
          <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className={cn(
                "size-2 rounded-full animate-pulse",
                isProcessing ? "bg-amber-500" : "bg-green-500"
              )} />
              <h1 className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground">
                <span className="text-foreground">Session:</span> {MOCK_CUSTOMER.id} // {MOCK_CUSTOMER.tier}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={isProcessing}
                onClick={() => simulateCustomerMessage("Where is my order? This is the third time I've reached out and no one has given me a straight answer. I am extremely frustrated!")}
                className="text-[10px] font-mono bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded border border-red-500/30 transition-all disabled:opacity-50"
              >
                Simulate Redline Event
              </button>
              <button
                disabled={isProcessing}
                onClick={() => simulateCustomerMessage("Hi, I'd like to upgrade my enterprise plan to include more seats.")}
                className="text-[10px] font-mono bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded border border-primary/30 transition-all disabled:opacity-50"
              >
                Simulate Positive Flow
              </button>
            </div>
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
        <aside className="w-80 bg-black/40 backdrop-blur-xl p-6 hidden lg:flex flex-col border-l border-white/5">
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