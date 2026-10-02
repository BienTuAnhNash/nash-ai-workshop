import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { authService } from '@/services/authService'

export const Route = createFileRoute('/_guest')({
  beforeLoad: async (ctx) => {
    const context = ctx.context as { queryClient: QueryClient }

    try {
      await context.queryClient.ensureQueryData({
        queryKey: ['me'],
        queryFn: async () => {
          return authService.getMe()
        },
      })
      return redirect({
        to: '/',
      })
    } catch (e) {
      //   throw redirect({
      //     to: '/',
      //   })
    }
  },
  component: Outlet,
})
