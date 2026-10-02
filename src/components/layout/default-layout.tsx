import { AppSidebar } from '../ui/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full min-h-screen">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DefaultLayout
