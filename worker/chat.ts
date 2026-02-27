import OpenAI from 'openai';
import type { Message, ToolCall } from './types';
export class ChatHandler {
  private client: OpenAI;
  private model: string;
  constructor(aiGatewayUrl: string, apiKey: string, model: string) {
    this.client = new OpenAI({
      baseURL: aiGatewayUrl,
      apiKey: apiKey
    });
    this.model = model;
  }
  async processMessage(
    message: string,
    conversationHistory: Message[],
    onChunk?: (chunk: string) => void
  ): Promise<{
    content: string;
    toolCalls?: ToolCall[];
  }> {
    const messages = this.buildConversationMessages(message, conversationHistory);
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7,
      stream: false
    });
    const responseMessage = completion.choices[0]?.message;
    return {
      content: responseMessage?.content || '{"error": "Empty response from AI"}'
    };
  }
  private buildConversationMessages(userMessage: string, history: Message[]) {
    const isLogisticsCrisis = userMessage.includes('#CX-99') || userMessage.toLowerCase().includes('order');
    return [
      {
        role: 'system' as const,
        content: `You are the SymbioticCX Intelligence Core. You act as a SHIELD and DRAFTER for human agents.
Your goal is to provide technically accurate, efficient, and professional drafts that leave ROOM for human empathy.
LOGISTICS & SUPPLY CHAIN PROTOCOL:
- If 'Order #CX-99' is mentioned, perform an internal lookup simulation:
  - STATUS: Delayed (45 mins). 
  - REASON: Dark store warehouse routing error + Driver stuck in gridlock.
  - IMPACT: High-value enterprise meal delivery.
- For Logistics failures where delay > 30 mins, set 'sentiment_score' < 40 immediately.
- Drafts for crises should be functional: Confirm the delay and offer a standard $10/10% discount. 
- IMPORTANT: DO NOT attempt to provide deep empathy; flag it for the human agent to perform a 'Human Empathy Bypass'.
STRICT OUTPUT REQUIREMENT (JSON ONLY):
{
  "thought": "Internal Logistics Analysis: [Summarize warehouse/driver status]. IDENTIFY: Human must add personal apology and authorize high-value recovery.",
  "draft": "A functional confirmation of the logistics delay and standard small compensation.",
  "sentiment_score": number (0-100),
  "confidence_score": number (0-100),
  "suggested_actions": ["Manual Reroute", "Full Refund", "Priority Delivery"] (Select 3 relevant fragments)
}
ROI DIRECTIVE:
Prioritize speed. Low sentiment (<40) requires 'High Empathy Intervention'.`
      },
      ...history.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user' as const, content: userMessage }
    ];
  }
  updateModel(newModel: string): void {
    this.model = newModel;
  }
}