import { useMe } from '@/hooks/queries/useGetMe'
import { createFileRoute } from '@tanstack/react-router'

import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useSignout } from '@/hooks/mutations/auth/useSingout'
import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/_authenticated/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isLoading, error, data } = useMe()
  const signOutMutation = useSignout()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const handleSignout = async () => {
    await signOutMutation.mutateAsync()
    window.location.href = ROUTES.SIGN_IN
  }

  return (
    <div>
      <div className="p-8 flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-4">User detail</h1>

        <p>
          <b>User ID:</b> {data?._id}
        </p>
        <p>
          <b>User Name:</b> {data?.name}
        </p>
        <p>
          <b>User Type:</b> {data?.role}
        </p>

        <Button
          variant="destructive"
          className="w-[100px]"
          onClick={handleSignout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
