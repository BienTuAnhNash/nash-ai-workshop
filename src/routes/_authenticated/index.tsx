import PageWrapper from '@/components/layout/page-wrapper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: Home,
})

// eslint-disable-next-line react-refresh/only-export-components
function Home() {
  return <PageWrapper pageTitle="Home">Content</PageWrapper>
}
