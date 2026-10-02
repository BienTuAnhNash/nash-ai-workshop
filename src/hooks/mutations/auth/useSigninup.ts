import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'

export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.signUp,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['me'],
      })
    },

    onError: (error) => {
      console.error(error)
    },
  })
}
