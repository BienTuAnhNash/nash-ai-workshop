import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { authService } from '@/services/authService'
import DefaultLayout from '@/components/layout/default-layout'
import { ROUTES } from '@/constants/routes'

function Layout() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  )
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async (ctx) => {
    const context = ctx.context as { queryClient: QueryClient }

    try {
      await context.queryClient.ensureQueryData({
        queryKey: ['me'],
        queryFn: async () => {
          return authService.getMe()
        },
      })
    } catch (e) {
      throw redirect({
        to: ROUTES.SIGN_IN,
      })
    }
  },
  component: Layout,
})
