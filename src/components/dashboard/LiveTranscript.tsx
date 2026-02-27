import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Bot, User, CheckCircle2, Clock, Terminal, ShieldCheck } from 'lucide-react';
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
      className="flex-1 overflow-y-auto p-6 space-y-8 font-sans scroll-smooth relative"
    >
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-10" />
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'user' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
              "flex flex-col max-w-[80%]",
              msg.role === 'user' ? "mr-auto" : "ml-auto items-end"
            )}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              {msg.role === 'user' ? (
                <>
                  <div className="size-5 rounded bg-white/10 flex items-center justify-center">
                    <User className="size-3 text-muted-foreground" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                    Customer Signal // {format(msg.timestamp, 'HH:mm:ss')}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                    {format(msg.timestamp, 'HH:mm:ss')} // Verified Agent Response
                  </span>
                  <div className="size-5 rounded bg-primary/20 flex items-center justify-center">
                    <ShieldCheck className="size-3 text-primary" />
                  </div>
                </>
              )}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed shadow-2xl relative group transition-all duration-300",
              msg.role === 'user'
                ? "bg-secondary/50 backdrop-blur-sm text-foreground rounded-tl-none border border-white/5"
                : "bg-primary text-primary-foreground rounded-tr-none border border-primary/20 shadow-primary/10"
            )}>
              {msg.content}
              {msg.role === 'assistant' && (
                <div className="absolute -bottom-6 right-1 flex items-center gap-1.5 opacity-60">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono uppercase text-muted-foreground">
                    <CheckCircle2 className="size-2.5 text-emerald-500" /> Human Gate Verified
                  </div>
                  <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono uppercase text-muted-foreground">
                    Via Centaur-OS
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-4">
          <div className="relative">
            <Terminal className="size-12 animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-mono uppercase tracking-[0.4em]">Establish Communication Link</p>
            <p className="text-[10px] font-mono opacity-50">Waiting for incoming telemetry packets...</p>
          </div>
        </div>
      )}
      <div className="h-10" /> {/* Bottom Spacer */}
    </div>
  );
}