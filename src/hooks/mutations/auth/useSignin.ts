import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'

export const useSignin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.signIn,

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
