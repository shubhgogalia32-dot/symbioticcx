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