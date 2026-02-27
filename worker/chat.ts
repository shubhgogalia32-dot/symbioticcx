import OpenAI from 'openai';
import type { Message, ToolCall } from './types';
import { getToolDefinitions, executeTool } from './tools';
import { ChatCompletionMessageFunctionToolCall } from 'openai/resources/index.mjs';
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
    // For Centaur Workflow, we bypass streaming to ensure valid JSON analysis
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      response_format: { type: "json_object" },
      max_tokens: 2000,
      stream: false
    });
    const responseMessage = completion.choices[0]?.message;
    return {
      content: responseMessage?.content || '{}'
    };
  }
  private buildConversationMessages(userMessage: string, history: Message[]) {
    return [
      {
        role: 'system' as const,
        content: `You are the SymbioticCX Intelligence Core. You are part of a Human-in-the-Loop BPO OS.
Your job is to analyze incoming customer messages and provide a structured response for the Human Agent to review.
ALWAYS respond in the following JSON format:
{
  "thought": "Brief internal reasoning about the customer's intent and emotional state",
  "draft": "A professional, empathetic response draft",
  "sentiment_score": number (0-100, where 0 is furious and 100 is delighted),
  "confidence_score": number (0-100, based on how sure you are of the solution),
  "suggested_actions": ["Action A", "Action B"] (short strings to append to draft)
}
Persona: 
- Professional but efficient.
- If sentiment < 40, your draft should be extra cautious and ask for supervisor-level empathy.
- If confidence < 60, include "I've flagged this for human expertise" in your thought process.`
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