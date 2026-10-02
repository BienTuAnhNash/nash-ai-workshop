import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/authService'

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  })
}
