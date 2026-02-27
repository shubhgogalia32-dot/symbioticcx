import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { SessionSelectPage } from '@/pages/SessionSelectPage'
import { AgentCockpit } from '@/components/dashboard/AgentCockpit'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { OnePagerPage } from '@/pages/OnePagerPage'

// Suppress Recharts 0x0/zero width/height warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args.length > 0 && typeof args[0] === 'string') {
    const msg = args[0];
    if (msg.includes('Recharts') && (msg.includes('zero') || msg.includes('0x0') || msg.includes('width/height') || msg.includes('width(0) and height(0)'))) {
      return;
    }
  }
  originalWarn.apply(console, args);
};
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <SessionSelectPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/cockpit/:sessionId",
    element: <AgentCockpit />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/onepager",
    element: <OnePagerPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)