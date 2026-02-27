import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
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
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AgentAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sentiment, setSentiment] = useState(72);
  const [initialSentiment, setInitialSentiment] = useState(72);
  const [confidence, setConfidence] = useState(95);
  const [editCount, setEditCount] = useState(0);
  useEffect(() => {
    if (sessionId) {
      chatService.switchSession(sessionId);
      chatService.getMessages().then(res => {
        if (res.success && res.data?.messages) {
          setMessages(res.data.messages as ExtendedMessage[]);
        }
      });
    }
  }, [sessionId]);
  const handleResolve = async () => {
    const delta = sentiment - initialSentiment;
    const humanValue = (editCount * 5) + (delta > 0 ? delta * 2 : 0);
    const res = await chatService.resolveSession(sessionId || 'active', {
      initialSentiment,
      finalSentiment: sentiment,
      humanEditsCount: editCount,
      complexityScore: 85,
      humanValueScore: Math.max(0, humanValue)
    });
    if (res.success) {
      toast.success("Session Transferred to Archive", {
        description: `ROI Achievement: ${delta >= 0 ? '+' : ''}${delta}% Empathy Delta | ${editCount} Human Context Layers Added`
      });
      navigate('/');
    }
  };
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    setEditCount(prev => prev + 1);
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
  const simulateCustomerMessage = useCallback(async (text: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const userMsg: ExtendedMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    try {
      const response = await chatService.sendMessage(text);
      if (response.success) {
        const refresh = await chatService.getMessages();
        if (refresh.success && refresh.data?.messages) {
          const lastMsg = refresh.data.messages[refresh.data.messages.length - 1];
          try {
            const analysis = JSON.parse(lastMsg.content) as AgentAnalysis;
            setCurrentAnalysis(analysis);
            setSentiment(analysis.sentiment_score);
            if (messages.length === 0) setInitialSentiment(analysis.sentiment_score);
            setConfidence(analysis.confidence_score);
            if (analysis.sentiment_score < 40) toast.error("Critical Sentiment Drop Detected");
          } catch (e) {
            console.warn("AI Packet Malformed, using recovery draft", e);
            setCurrentAnalysis(FALLBACK_ANALYSIS);
          }
        }
      }
    } finally { setIsProcessing(false); }
  }, [isProcessing, messages.length]);
  return (
    <AppLayout className="bg-[#09090b] text-white">
      <div className={cn("flex h-screen w-full", sentiment < 40 ? "ring-4 ring-inset ring-red-500/30" : "")}>
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 relative">
          <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-10">
            <h1 className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground">
              LINK: {sessionId || 'CENTAUR-01'} // EM Δ: {sentiment - initialSentiment}%
            </h1>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="h-8 font-mono text-[10px] uppercase" onClick={handleResolve}>
                <CheckCircle2 className="size-3 mr-2 text-emerald-500" /> Resolve Session
              </Button>
              <button onClick={() => simulateCustomerMessage("I am frustrated with the delay.")} className="text-[10px] font-mono bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                Trigger Escalation
              </button>
            </div>
          </header>
          <LiveTranscript messages={messages} />
          <ControlDeck analysis={currentAnalysis} onSend={handleSendMessage} onReject={() => setCurrentAnalysis(null)} isProcessing={isProcessing} />
        </div>
        <aside className="w-80 bg-black/40 p-6 hidden lg:flex flex-col border-l border-white/5">
          <IntelligencePanel profile={MOCK_CUSTOMER} sentiment={sentiment} confidence={confidence} />
        </aside>
      </div>
    </AppLayout>
  );
}