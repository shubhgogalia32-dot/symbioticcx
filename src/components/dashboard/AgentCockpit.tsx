import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  thought: "Neural processing error. System reverted to safety-net protocols. Manual empathy required.",
  draft: "I apologize for the confusion. We are looking into your order status right now. How can I best assist you in the meantime?",
  sentiment_score: 50,
  confidence_score: 100,
  suggested_actions: ["Standard Greeting", "Manual Check"]
};
export function AgentCockpit() {
  const { sessionId: routeSessionId } = useParams<{ sessionId: string }>();
  const sessionId = routeSessionId || 'active';
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AgentAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sentiment, setSentiment] = useState(72);
  const [initialSentiment, setInitialSentiment] = useState(72);
  const [confidence, setConfidence] = useState(95);
  const [editCount, setEditCount] = useState(0);
  const [isCrisisResolved, setIsCrisisResolved] = useState(false);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  const loadMessages = useCallback(async () => {
    const res = await chatService.getMessages();
    if (res.success && res.data?.messages && isMounted.current) {
      setMessages(res.data.messages as ExtendedMessage[]);
    }
  }, []);
  useEffect(() => {
    chatService.switchSession(sessionId);
    loadMessages();
  }, [sessionId, loadMessages]);
  const handleResolve = async () => {
    const delta = sentiment - initialSentiment;
    const humanValue = (editCount * 10) + (delta > 0 ? delta * 5 : 0) + (isCrisisResolved ? 500 : 0);
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
      toast.success("Strategic Resolution Authenticated", {
        description: `ROI: ${delta >= 0 ? '+' : ''}${delta}% Empathy Delta | $${isCrisisResolved ? '2,000' : '0'} LTV Recovered`
      });
      navigate('/analytics');
    }
  };
  const simulateCustomerStep = async (text: string, isInitial = false) => {
    setIsProcessing(true);
    try {
      const response = await chatService.sendMessage(text);
      if (response.success && response.draft && isMounted.current) {
        await loadMessages();
        try {
          const analysis = JSON.parse(response.draft) as AgentAnalysis;
          setCurrentAnalysis(analysis);
          setSentiment(analysis.sentiment_score);
          setConfidence(analysis.confidence_score);
          if (isInitial) setInitialSentiment(analysis.sentiment_score);
          if (analysis.sentiment_score < 40) {
            toast.error("REDLINE PROTOCOL ACTIVE", { 
              description: "Logistics Failure Detected // Empathy Bypass Required",
              duration: 5000
            });
          }
        } catch (e) {
          console.error("AI Output Parse Error:", e);
          setCurrentAnalysis(FALLBACK_ANALYSIS);
        }
      }
    } finally {
      if (isMounted.current) setIsProcessing(false);
    }
  };
  const triggerDemoScenario = async () => {
    if (isProcessing) return;
    toast.info("Initializing Crisis Simulation: Node #CX-99");
    setMessages([]);
    setEditCount(0);
    setIsCrisisResolved(false);
    setCurrentAnalysis(null);
    // Controlled sequence to prevent race conditions
    await simulateCustomerStep("Where is my order #CX-99? It's been an hour.", true);
    setTimeout(async () => {
      if (isMounted.current) {
        await simulateCustomerStep("Still no food. Cancel my account immediately. Your service is a joke.");
      }
    }, 5000);
  };
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await chatService.commitMessage(content);
      if (res.success && isMounted.current) {
        setEditCount(prev => prev + 1);
        if (content.toLowerCase().match(/refund|reroute|priority/)) {
          setIsCrisisResolved(true);
          setSentiment(prev => Math.min(95, prev + 25));
        }
        setCurrentAnalysis(null);
        await loadMessages();
        toast.success("Transmission Verified", { icon: <Zap className="size-3" /> });
      }
    } finally {
      if (isMounted.current) setIsProcessing(false);
    }
  };
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className={cn(
        "flex h-screen w-full transition-all duration-1000", 
        sentiment < 40 ? "ring-[12px] ring-inset ring-red-500/20" : ""
      )}>
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 relative">
          <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <h1 className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-3">
                <span className={cn(
                  "size-2 rounded-full", 
                  sentiment < 40 ? "bg-red-500 animate-ping" : "bg-primary animate-pulse"
                )}></span>
                SESSION: {sessionId.slice(0, 8)} // EM Δ: {sentiment - initialSentiment}%
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 font-mono text-[9px] uppercase border-amber-500/40 text-amber-500 hover:bg-amber-500/10" onClick={triggerDemoScenario} disabled={isProcessing}>
                <AlertTriangle className="size-3 mr-2" /> Trigger Crisis
              </Button>
              <Button size="sm" variant="outline" className="h-8 font-mono text-[9px] uppercase bg-white/5 border-white/10" onClick={loadMessages}>
                <RefreshCw className={cn("size-3 mr-2", isProcessing && "animate-spin")} />
              </Button>
              <Button size="sm" variant="outline" className="h-8 font-mono text-[9px] uppercase border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10" onClick={handleResolve}>
                <CheckCircle2 className="size-3 mr-2" /> Resolve
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
        <aside className="w-80 bg-black/40 p-6 hidden lg:flex flex-col border-l border-white/5 overflow-hidden">
          <IntelligencePanel profile={MOCK_CUSTOMER} sentiment={sentiment} confidence={confidence} />
        </aside>
      </div>
    </AppLayout>
  );
}