import { toast } from 'sonner'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, ChevronDown, Home, User2, Settings } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { useMe } from '@/hooks/queries/useGetMe'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { useSignout } from '@/hooks/mutations/auth/useSingout'
import { ROUTES } from '@/constants/routes'

export function AppSidebar() {
  const navigate = useNavigate()

  const { data: user } = useMe()
  const signOutMutation = useSignout()

  const menus = [
    {
      to: ROUTES.HOME,
      label: 'Home',
      icon: Home,
    },
    {
      to: ROUTES.SETTINGS,
      label: 'Settings',
      icon: Settings,
    },
  ]

  const handleClickSignout = async () => {
    try {
      await signOutMutation.mutate()
      window.location.href = ROUTES.SIGN_IN
      return
    } catch (error) {
      console.error('Signout failed:', error)
      toast.error('Signout failed.', { position: 'bottom-left' })
      return
    }
  }

  const handleClickAccount = () => {
    navigate({ to: '/account' })
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                <SidebarMenu>
                  {menus.map((item) => {
                    const Icon = item.icon
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.to}
                            activeProps={{
                              className:
                                'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                            }}
                          >
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex justify-between w-full">
                <div className="flex gap-2" onClick={handleClickAccount}>
                  <User2 /> {user?.name}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowRight
                      className="hover:text-red-400"
                      onClick={handleClickSignout}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign out</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
