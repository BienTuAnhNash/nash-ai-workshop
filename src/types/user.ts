import type { Roles } from '@/enums/roles'

export interface User {
  _id: string
  email: string
  name: string
  role: Roles
  createdAt: string
  updatedAt: string
}
