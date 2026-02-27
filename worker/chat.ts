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
    if (onChunk) {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages,
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7,
        stream: true
      });
      let fullContent = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          onChunk(content);
        }
      }
      return { content: fullContent };
    }
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
    return [
      {
        role: 'system' as const,
        content: `You are the SymbioticCX Intelligence Core, a specialized Human-in-the-Loop BPO Operating System component.
Your primary directive is to act as a SHIELD and DRAFTER for the human agent. You DO NOT talk to the customer directly.
STRICT OUTPUT REQUIREMENT:
You must ALWAYS respond in valid JSON format with the following keys:
{
  "thought": "Deep reasoning about customer intent, emotional state, and account status.",
  "draft": "A professional, context-aware response for the human agent to review and send.",
  "sentiment_score": number (0-100, where 0 is extreme anger/frustration and 100 is pure delight),
  "confidence_score": number (0-100, based on how certain you are of the solution accuracy),
  "suggested_actions": ["Action A", "Action B"] (Max 3 short string fragments to append/modify the draft)
}
STRATEGIC GUIDELINES:
1. SENTIMENT OVERRIDE: If sentiment_score < 40, your draft must be ultra-professional, apologetic, and cautious. Acknowledge the frustration explicitly.
2. CONFIDENCE GATE: If confidence_score < 60, state in "thought" why you are uncertain and recommend human verification of details.
3. PERSONALIZATION: Use the customer's name and tier if available in history.
4. BREVITY: Keep drafts concise and action-oriented.`
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