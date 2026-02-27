import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, RefreshCw, AlertTriangle, Zap } from 'lucide-react';
import { LiveTranscript } from './LiveTranscript';
import { IntelligencePanel } from './IntelligencePanel';
import { ControlDeck } from './ControlDeck';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
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
const FALLBACK_ANALYSIS: AgentAnalysis = {
  thought: "Signal processed with standard utility parameters.",
  draft: "Thank you for reaching out. We are looking into your request immediately.",
  sentiment_score: 50,
  confidence_score: 100,
  suggested_actions: ["Standard Greeting"]
};
export function AgentCockpit() {
  const { sessionId: routeSessionId } = useParams<{ sessionId: string }>();
  const sessionId = routeSessionId || 'active';
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AgentAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sentiment, setSentiment] = useState(72);
  const [initialSentiment, setInitialSentiment] = useState(72);
  const [confidence, setConfidence] = useState(95);
  const [editCount, setEditCount] = useState(0);
  const [isCrisisResolved, setIsCrisisResolved] = useState(false);
  const loadMessages = useCallback(async () => {
    const res = await chatService.getMessages();
    if (res.success && res.data?.messages) {
      setMessages(res.data.messages as ExtendedMessage[]);
    }
  }, []);
  useEffect(() => {
    chatService.switchSession(sessionId);
    loadMessages();
  }, [sessionId, loadMessages]);
  const handleResolve = async () => {
    const delta = sentiment - initialSentiment;
    const humanValue = (editCount * 5) + (delta > 0 ? delta * 2 : 0) + (isCrisisResolved ? 200 : 0);
    const res = await chatService.resolveSession(sessionId, {
      initialSentiment,
      finalSentiment: sentiment,
      humanEditsCount: editCount,
      complexityScore: isCrisisResolved ? 98 : 85,
      humanValueScore: Math.max(0, humanValue),
      isCrisisResolved,
      churnRecoveryLtv: isCrisisResolved ? 2000 : 0
    });
    if (res.success) {
      toast.success("Session Transferred to Archive", {
        description: `ROI Achievement: ${delta >= 0 ? '+' : ''}${delta}% Empathy Delta | ${isCrisisResolved ? 'High-Value Recovery Authenticated' : 'Standard Resolution'}`
      });
      navigate('/analytics');
    }
  };
  const simulateCustomerMessage = async (text: string) => {
    setIsProcessing(true);
    try {
      const response = await chatService.sendMessage(text);
      if (response.success && response.draft) {
        await loadMessages();
        try {
          const analysis = JSON.parse(response.draft) as AgentAnalysis;
          setCurrentAnalysis(analysis);
          setSentiment(analysis.sentiment_score);
          setConfidence(analysis.confidence_score);
          if (analysis.sentiment_score < 40) {
            toast.error("CRITICAL SENTIMENT DROP", { description: "Logistics Redline Detected - Human Override Required" });
          }
        } catch (e) {
          setCurrentAnalysis(FALLBACK_ANALYSIS);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };
  const triggerDemoScenario = async () => {
    toast.info("Initializing Food-Tech Crisis Simulation...");
    setMessages([]);
    setInitialSentiment(72);
    setSentiment(72);
    setIsCrisisResolved(false);
    // Step 1: Inbound Inquiry
    await simulateCustomerMessage("Where is my order #CX-99? It was supposed to be here 45 minutes ago.");
    // Wait for the agent to potentially see the first draft, then escalate
    setTimeout(async () => {
      await simulateCustomerMessage("This is unacceptable. I have a board meeting and no food. Cancel my subscription, I'm done with this service.");
    }, 4000);
  };
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await chatService.commitMessage(content);
      if (res.success) {
        setEditCount(prev => prev + 1);
        if (content.toLowerCase().includes('refund') || content.toLowerCase().includes('reroute')) {
          setIsCrisisResolved(true);
          setSentiment(90); // Optimistic recovery
        }
        setCurrentAnalysis(null);
        await loadMessages();
        toast.success("Response verified and transmitted");
      }
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className={cn("flex h-screen w-full transition-all duration-700", sentiment < 40 ? "ring-8 ring-inset ring-red-500/30" : "")}>
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 relative">
          <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-10">
            <h1 className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-3">
              <span className={cn("size-2 rounded-full", sentiment < 40 ? "bg-red-500 animate-ping" : "bg-primary animate-pulse")}></span> 
              LINK: {sessionId.slice(0, 8)} // EM Δ: {sentiment - initialSentiment}%
            </h1>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="h-8 font-mono text-[10px] uppercase border-amber-500/40 text-amber-500 hover:bg-amber-500/10" onClick={triggerDemoScenario}>
                <AlertTriangle className="size-3 mr-2" /> Demo Supply Chain Fail
              </Button>
              <Button size="sm" variant="outline" className="h-8 font-mono text-[10px] uppercase bg-white/5 border-white/10" onClick={loadMessages}>
                <RefreshCw className={cn("size-3 mr-2", isProcessing && "animate-spin")} /> Refresh
              </Button>
              <Button size="sm" variant="outline" className="h-8 font-mono text-[10px] uppercase border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10" onClick={handleResolve}>
                <CheckCircle2 className="size-3 mr-2" /> Resolve Session
              </Button>
            </div>
          </header>
          <LiveTranscript messages={messages} />
          <ControlDeck 
            analysis={currentAnalysis} 
            onSend={handleSendMessage} 
            onReject={() => setCurrentAnalysis(null)} 
            isProcessing={isProcessing} 
          />
        </div>
        <aside className="w-80 bg-black/40 p-6 hidden lg:flex flex-col border-l border-white/5">
          <IntelligencePanel profile={MOCK_CUSTOMER} sentiment={sentiment} confidence={confidence} />
        </aside>
      </div>
    </AppLayout>
  );
}