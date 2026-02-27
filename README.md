# Cloudflare Workers AI Chat Agent

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=${repositoryUrl})
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/shubhgogalia32-dot/symbioticcx)

A production-ready, full-stack AI chat application built on Cloudflare Workers. Features persistent conversations using Durable Objects, streaming AI responses via Cloudflare AI Gateway, tool calling (weather, web search), multi-session management, and a modern React UI.

## 🚀 Features

- **Persistent Chat Sessions**: Unlimited conversations stored in Durable Objects with automatic session listing, creation, and deletion.
- **AI Model Support**: Switch between models like Gemini 2.5 Flash/Pro via Cloudflare AI Gateway.
- **Streaming Responses**: Real-time typing effect for natural chat experience.
- **Tool Calling**: Built-in tools for weather lookup and web search (SerpAPI integration).
- **Session Management**: Create, list, rename, delete sessions via API and UI.
- **Modern UI**: Responsive design with shadcn/ui, Tailwind CSS, dark mode, and smooth animations.
- **Type-Safe**: Full TypeScript with end-to-end types.
- **Production-Ready**: CORS, error handling, logging, and Cloudflare observability.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide Icons, TanStack Query, React Router
- **Backend**: Cloudflare Workers, Hono, Durable Objects (Agents SDK), OpenAI SDK
- **AI**: Cloudflare AI Gateway, Gemini models, Tool Calling
- **Storage**: Durable Objects (SQLite-backed)
- **Tools**: SerpAPI (web search), MCP (extensible tools)
- **Build Tools**: Bun, Wrangler, Vite

## 📦 Installation

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed
   - [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) installed
   - Cloudflare account with AI Gateway configured

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd symbiotic-cx-tucy6swqb6s3khgcrrqea
   bun install
   ```

3. **Configure Environment** (edit `wrangler.jsonc`):
   ```json
   "vars": {
     "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai",
     "CF_AI_API_KEY": "your-cloudflare-api-token",
     "SERPAPI_KEY": "your-serpapi-key"  // Optional for web search
   }
   ```

4. **Generate Types**:
   ```bash
   bun run cf-typegen
   ```

## 🔄 Development

- **Local Development**:
  ```bash
  bun dev
  ```
  Opens at `http://localhost:3000` (or `${PORT:-3000}`).

- **Preview Production Build**:
  ```bash
  bun run preview
  ```

- **Lint & Type Check**:
  ```bash
  bun lint
  bun tsc --noEmit
  ```

## 🚀 Deployment

Deploy to Cloudflare Workers with zero configuration:

```bash
bun run deploy
```

This builds the frontend assets, bundles the worker, and deploys everything.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/shubhgogalia32-dot/symbioticcx)

**Post-Deployment**:
- Configure `wrangler.jsonc` vars in Cloudflare dashboard (Workers > Your Worker > Settings > Variables).
- Enable Durable Objects in production (automatic via Wrangler).

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sessions` | GET | List all sessions |
| `/api/sessions` | POST | Create new session `{ title?: string, firstMessage?: string }` |
| `/api/sessions/:id` | DELETE | Delete session |
| `/api/sessions/:id/title` | PUT | Update title `{ title: string }` |
| `/api/chat/:sessionId/chat` | POST | Send message `{ message: string, model?: string, stream?: boolean }` |
| `/api/chat/:sessionId/messages` | GET | Get chat state |
| `/api/chat/:sessionId/clear` | DELETE | Clear messages |
| `/api/chat/:sessionId/model` | POST | Update model `{ model: string }` |

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. Create feature branch: `git checkout -b feature/awesome`
4. Commit: `git commit -m "feat: add awesome feature"`
5. Push & PR

Follow TypeScript, ESLint, and Prettier rules.

## 🔒 Environment Variables

| Var | Required | Description |
|-----|----------|-------------|
| `CF_AI_BASE_URL` | Yes | AI Gateway endpoint |
| `CF_AI_API_KEY` | Yes | Cloudflare API token |
| `SERPAPI_KEY` | No | SerpAPI key for web search |
| `OPENROUTER_API_KEY` | No | OpenRouter fallback |

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.