import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Bot, User, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExtendedMessage } from '@/lib/types';
interface LiveTranscriptProps {
  messages: ExtendedMessage[];
}
export function LiveTranscript({ messages }: LiveTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-6 font-sans scroll-smooth"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-col max-w-[85%]",
              msg.role === 'user' ? "mr-auto" : "ml-auto items-end"
            )}
          >
            <div className="flex items-center gap-2 mb-1.5 px-1">
              {msg.role === 'user' ? (
                <>
                  <User className="size-3 text-muted-foreground" />
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Customer • {format(msg.timestamp, 'HH:mm:ss')}</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">{format(msg.timestamp, 'HH:mm:ss')} • Agent Cockpit</span>
                  <Bot className="size-3 text-primary" />
                </>
              )}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-secondary text-foreground rounded-tl-none border border-white/5" 
                : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10"
            )}>
              {msg.content}
            </div>
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-1 mt-1 px-1">
                <CheckCircle2 className="size-3 text-green-500" />
                <span className="text-[10px] text-muted-foreground italic">Human Verified</span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-50">
          <Clock className="size-8" />
          <p className="text-sm font-mono">Awaiting communication link...</p>
        </div>
      )}
    </div>
  );
}