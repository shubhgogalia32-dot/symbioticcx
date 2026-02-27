import React, { useState, useEffect } from 'react';
import { Send, RotateCcw, ShieldAlert, Cpu, Sparkles, MessageSquareWarning, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AgentAnalysis } from '@/lib/types';
interface ControlDeckProps {
  analysis: AgentAnalysis | null;
  onSend: (message: string) => void;
  onReject: () => void;
  isProcessing: boolean;
}
export function ControlDeck({ analysis, onSend, onReject, isProcessing }: ControlDeckProps) {
  const [draft, setDraft] = useState('');
  const [hasEdited, setHasEdited] = useState(false);
  useEffect(() => {
    if (analysis?.draft) {
      setDraft(analysis.draft);
      setHasEdited(false);
    }
  }, [analysis]);
  const isSentimentRedline = (analysis?.sentiment_score ?? 100) < 40;
  const isLogisticsCrisis = analysis?.thought.toLowerCase().includes('logistics') || analysis?.thought.toLowerCase().includes('cx-99');
  const isLocked = isSentimentRedline && !hasEdited;
  const handleTextChange = (val: string) => {
    setDraft(val);
    if (val !== analysis?.draft) {
      setHasEdited(true);
    }
  };
  const applyAction = (action: string) => {
    let prefix = "";
    if (action === "Full Refund") prefix = "I've authorized a full refund for Order #CX-99 immediately and added $50 credit to your account. ";
    if (action === "Manual Reroute") prefix = "I have manually rerouted a new courier from our secondary hub to ensure your meal arrives in the next 15 minutes. ";
    if (action === "Priority Delivery") prefix = "I've escalated this to our priority dispatch team. ";
    setDraft(prefix + draft);
    setHasEdited(true);
  };
  return (
    <div className="p-5 border-t border-white/10 bg-black/60 backdrop-blur-xl relative">
      <div className="max-w-4xl mx-auto space-y-4">
        {analysis ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Cpu className="size-4 text-primary" />
                  <Sparkles className="size-2 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">AI Intelligence Synthesis</span>
                {isSentimentRedline && (
                  <Badge variant="destructive" className="h-5 text-[9px] gap-1 px-2 font-bold animate-pulse border-red-500/50">
                    <ShieldAlert className="size-3" /> {isLogisticsCrisis ? "LOGISTICS CRISIS DETECTED" : "EMOTIONAL OVERRIDE ACTIVE"}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {analysis.suggested_actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => applyAction(action)}
                    className="text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-colors flex items-center gap-1"
                  >
                    <Zap className="size-2.5 text-amber-500" /> {action}
                  </button>
                ))}
              </div>
            </div>
            {isLocked && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-[10px] font-mono uppercase tracking-tight">
                <MessageSquareWarning className="size-4 shrink-0" />
                <span>Manual Empathy Bypass Required: AI draft is insufficient for current crisis level. Authorize refund/reroute to resolve.</span>
              </div>
            )}
            <div className="relative group">
              <Textarea
                value={draft}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Synthesizing context..."
                disabled={isProcessing}
                className={cn(
                  "min-h-[140px] bg-white/5 border-white/10 focus:ring-primary/50 font-sans text-sm resize-none transition-all duration-300",
                  isSentimentRedline && !hasEdited ? "border-red-500/40 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-primary/20",
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                )}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant="secondary" className="bg-black/40 text-[9px] font-mono border-white/5 backdrop-blur-sm">
                  CONFIDENCE: {analysis.confidence_score}%
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/10 hover:bg-white/5 hover:text-white font-mono text-xs uppercase"
                onClick={onReject}
                disabled={isProcessing}
              >
                <RotateCcw className="size-3 mr-2" /> Discard Draft
              </Button>
              <Button
                className={cn(
                  "flex-[2.5] font-mono text-xs uppercase tracking-widest font-bold transition-all duration-500 h-11",
                  isLocked ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                )}
                onClick={() => onSend(draft)}
                disabled={isProcessing || !draft.trim() || isLocked}
              >
                {isProcessing ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Send className="size-4 mr-2" />
                )}
                {isSentimentRedline ? (hasEdited ? "Execute Empathy Bypass" : "Human Override Required") : "Approve & Transmit"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-muted-foreground/40 space-y-3">
             {isProcessing ? (
                <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
             ) : (
                <div className="relative">
                  <Cpu className="size-10 opacity-20" />
                  <div className="absolute inset-0 blur-xl bg-primary/10 rounded-full" />
                </div>
             )}
             <p className="text-xs font-mono uppercase tracking-[0.3em]">
               {isProcessing ? "Analyzing Logistics Packets..." : "Standing by for Customer Signal"}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}