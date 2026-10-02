import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NavigationProgress } from '@/components/ui/navigation-progress'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <NavigationProgress />
      <QueryProvider>
        <TooltipProvider>
          <Toaster />
          <Outlet />
        </TooltipProvider>
      </QueryProvider>
    </>
  ),
})
