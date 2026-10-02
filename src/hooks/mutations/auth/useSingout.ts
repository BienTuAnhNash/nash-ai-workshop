import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'

export const useSignout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.signOut,

    onSuccess: async () => {
      await queryClient.removeQueries({
        queryKey: ['me'],
      })
    },

    onError: (error) => {
      console.error(error)
    },
  })
}
