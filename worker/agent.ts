import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState, Message } from './types';
import { ChatHandler } from './chat';
import { API_RESPONSES } from './config';
import { createMessage, createStreamResponse, createEncoder } from './utils';
export class ChatAgent extends Agent<Env, ChatState> {
  private chatHandler?: ChatHandler;
  initialState: ChatState = {
    messages: [],
    sessionId: crypto.randomUUID(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.5-flash'
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL,
      this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  async onRequest(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const method = request.method;
      if (method === 'GET' && url.pathname === '/messages') {
        return Response.json({ success: true, data: this.state });
      }
      if (method === 'POST' && url.pathname === '/chat') {
        return this.handleChatMessage(await request.json());
      }
      if (method === 'POST' && url.pathname === '/commit') {
        return this.handleCommitMessage(await request.json());
      }
      if (method === 'DELETE' && url.pathname === '/clear') {
        this.setState({ ...this.state, messages: [] });
        return Response.json({ success: true, data: this.state });
      }
      return Response.json({ success: false, error: API_RESPONSES.NOT_FOUND }, { status: 404 });
    } catch (error) {
      console.error('Request handling error:', error);
      return Response.json({ success: false, error: API_RESPONSES.INTERNAL_ERROR }, { status: 500 });
    }
  }
  private async handleChatMessage(body: { message: string; model?: string }): Promise<Response> {
    const { message, model } = body;
    if (!message?.trim()) return Response.json({ success: false, error: API_RESPONSES.MISSING_MESSAGE }, { status: 400 });
    if (model && model !== this.state.model) {
      this.setState({ ...this.state, model });
      this.chatHandler?.updateModel(model);
    }
    const userMessage = createMessage('user', message.trim());
    const updatedMessages = [...this.state.messages, userMessage];
    this.setState({ ...this.state, messages: updatedMessages, isProcessing: true });
    try {
      if (!this.chatHandler) throw new Error('Chat handler not initialized');
      // AI returns a JSON draft analysis
      const response = await this.chatHandler.processMessage(message, updatedMessages);
      this.setState({ ...this.state, isProcessing: false });
      // We do NOT append the assistant JSON to history. 
      // We return it to the UI for human review/edit.
      return Response.json({
        success: true,
        draft: response.content,
        data: this.state
      });
    } catch (error) {
      this.setState({ ...this.state, isProcessing: false });
      return Response.json({ success: false, error: API_RESPONSES.PROCESSING_ERROR }, { status: 500 });
    }
  }
  private async handleCommitMessage(body: { content: string }): Promise<Response> {
    const { content } = body;
    if (!content?.trim()) return Response.json({ success: false, error: 'Empty content' }, { status: 400 });
    const assistantMessage = createMessage('assistant', content.trim());
    this.setState({
      ...this.state,
      messages: [...this.state.messages, assistantMessage],
      isProcessing: false
    });
    return Response.json({ success: true, data: this.state });
  }
}