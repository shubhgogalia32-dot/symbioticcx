import React, { useState, useEffect } from 'react';
import { Send, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { AgentAnalysis } from '@/lib/types';
interface ControlDeckProps {
  analysis: AgentAnalysis | null;
  onSend: (message: string) => void;
  onReject: () => void;
  isProcessing: boolean;
}
export function ControlDeck({ analysis, onSend, onReject, isProcessing }: ControlDeckProps) {
  const [draft, setDraft] = useState('');
  useEffect(() => {
    if (analysis?.draft) {
      setDraft(analysis.draft);
    }
  }, [analysis]);
  const isLocked = (analysis?.sentiment_score ?? 100) < 40;
  return (
    <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
      <div className="max-w-4xl mx-auto space-y-4">
        {analysis ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-primary animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">AI Augmented Draft</span>
                {isLocked && (
                  <Badge variant="destructive" className="h-5 text-[9px] gap-1">
                    <ShieldAlert className="size-3" /> Sentiment Redline
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {analysis.suggested_actions.map((action, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] bg-white/5 cursor-pointer hover:bg-white/10" onClick={() => setDraft(prev => prev + " " + action)}>
                    +{action}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="relative group">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="AI is preparing a draft..."
                className="min-h-[100px] bg-white/5 border-white/10 focus:ring-primary/50 font-sans text-sm resize-none"
              />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-muted-foreground bg-black/80 px-2 py-1 rounded border border-white/10">ESC to Clear</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-white/10 hover:bg-white/5"
                onClick={onReject}
                disabled={isProcessing}
              >
                <RotateCcw className="size-4 mr-2" /> Reject Draft
              </Button>
              <Button 
                className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                onClick={() => onSend(draft)}
                disabled={isProcessing || !draft.trim() || (isLocked && draft === analysis.draft)}
              >
                <Send className="size-4 mr-2" /> {isLocked ? 'Verify & Send' : 'Approve & Send'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[180px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg text-muted-foreground text-sm font-mono italic">
            {isProcessing ? "AI synthesizing response strategy..." : "Standing by for customer input..."}
          </div>
        )}
      </div>
    </div>
  );
}