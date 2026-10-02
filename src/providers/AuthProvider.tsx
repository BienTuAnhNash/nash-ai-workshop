import type { ReactNode } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'

import { useMe } from '@/hooks/queries/useGetMe'
import { ROUTES } from '@/constants/routes'

interface Props {
  children: ReactNode
}

export default function AuthProvider({ children }: Props) {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const { data: user, isLoading, isError } = useMe()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    if (pathname !== ROUTES.SIGN_IN) {
      navigate({
        to: ROUTES.SIGN_IN,
        replace: true,
      })
    }

    return <>{children}</>
  }

  if (user && pathname === ROUTES.SIGN_IN) {
    navigate({
      to: '/',
      replace: true,
    })
  }

  return <>{children}</>
}
