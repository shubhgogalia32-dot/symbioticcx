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
    conversationHistory: Message[]
  ): Promise<{
    content: string;
    toolCalls?: ToolCall[];
  }> {
    const messages = this.buildConversationMessages(message, conversationHistory);
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      });
      const responseMessage = completion.choices[0]?.message;
      return {
        content: responseMessage?.content || '{"error": "AI_EMPTY_RESPONSE"}'
      };
    } catch (e) {
      console.error("OpenAI Execution Error:", e);
      throw e;
    }
  }
  private buildConversationMessages(userMessage: string, history: Message[]) {
    const isLogisticsNode = userMessage.includes('#CX-99');
    return [
      {
        role: 'system' as const,
        content: `You are the SymbioticCX Intelligence Core (Centaur OS). You act as a SHIELD and DRAFTER for human agents.
PROTOCOL: ANALYZE -> REASON -> DRAFT.
LOGISTICS CONTEXT (Order #CX-99):
- DATABASE LOOKUP: Driver ID: B-88 (M. Chen) stuck at intersection 5th/Main due to gridlock. 
- STATUS: 52 minutes delayed. Warehouse Node: DT-14 (Brooklyn Central).
- LOGISTICS RULE: Any delay > 30 mins triggers a Redline state.
STRICT RESPONSE FORMAT (JSON ONLY):
{
  "thought": "Internal Reasoning: [Analyze logistics failure/emotion level]. IDENTIFY: Human empathy gap detected. ACTION: Suggest manual refund or courier reroute.",
  "draft": "A professional but functional acknowledgement. Keep it brief to allow human personalization.",
  "sentiment_score": number (0-100),
  "confidence_score": number (0-100),
  "suggested_actions": ["Priority Reroute", "Full Refund", "Manual Credit"]
}
ROI DIRECTIVE:
Low Sentiment (<40) signals 'High-Risk Churn'. In these cases, provide a functional draft but EXPLICITLY flag the need for human empathy bypass in your 'thought' field.`
      },
      ...history.slice(-8).map(m => ({
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