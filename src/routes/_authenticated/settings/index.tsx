import PageWrapper from '@/components/layout/page-wrapper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageWrapper pageTitle="Settings">
      Content
    </PageWrapper>
  )
}
