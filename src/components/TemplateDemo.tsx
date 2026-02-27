import React, { useState } from 'react';
import { chatService, MODELS } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Terminal } from 'lucide-react';
export function TemplateDemo() {
  const [model, setModel] = useState(MODELS[0].id);
  const [status, setStatus] = useState<'idle' | 'syncing'>('idle');
  const handleSync = async () => {
    setStatus('syncing');
    await chatService.getAnalytics();
    setTimeout(() => setStatus('idle'), 1000);
  };
  return (
    <Card className="cockpit-panel bg-black/40 border-white/5">
      <CardHeader>
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Terminal className="size-4" /> Environment Config
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-muted-foreground">Neural Engine</label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-white/5 border-white/10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-mono text-[10px] uppercase"
          onClick={handleSync}
          disabled={status === 'syncing'}
        >
          {status === 'syncing' ? 'Recalibrating...' : 'Force Analytics Sync'}
        </Button>
      </CardContent>
    </Card>
  );
}