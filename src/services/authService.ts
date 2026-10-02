import type { SignInDTO, SignOutDTO } from '@/types/auth'
import type { User } from '@/types/user'

import { axiosClient } from '../libs/axios'

const AUTH_BASE_URL = '/auth'

export const authService = {
  async signIn(data: SignInDTO) {
    const response = await axiosClient.post(`${AUTH_BASE_URL}/signin`, data)
    return response.data
  },

  async signUp(data: SignOutDTO) {
    const response = await axiosClient.post(`${AUTH_BASE_URL}/signup`, data)
    return response.data
  },

  async signOut() {
    const response = await axiosClient.post(`${AUTH_BASE_URL}/logout`)
    return response.data
  },

  async getMe(): Promise<User> {
    const response = await axiosClient.get(`${AUTH_BASE_URL}/me`)
    return response.data
  },
}
