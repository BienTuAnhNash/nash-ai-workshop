import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import NProgress from 'nprogress'

export function NavigationProgress() {
  const isLoading = useRouterState({
    select: (s) => s.status === 'pending',
  })

  useEffect(() => {
    if (isLoading) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }, [isLoading])

  return null
}
