import type { SignInDTO, SignOutDTO } from '@/types/auth'
import type { User } from '@/types/user'
import type { Roles } from '@/enums/roles'

import { localDb } from '@/libs/localDb'
import { Roles as RoleEnum } from '@/enums/roles'

type UserRecord = User & {
  password: string
}

interface AuthSessionRecord {
  _id: string
  userId: string
  createdAt: string
}

const USERS_TABLE = 'users'
const AUTH_SESSIONS_TABLE = 'auth_sessions'

const createId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const now = () => new Date().toISOString()

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const toUserModel = (user: UserRecord): User => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

const createSession = (userId: string) => {
  const session: AuthSessionRecord = {
    _id: 'current-session',
    userId,
    createdAt: now(),
  }

  localDb.setTable<AuthSessionRecord>(AUTH_SESSIONS_TABLE, [session])
}

const getCurrentSession = () => {
  const sessions = localDb.getTable<AuthSessionRecord>(AUTH_SESSIONS_TABLE)
  return sessions[0]
}

const createUserRecord = ({
  name,
  email,
  password,
  role = RoleEnum.USER,
}: {
  name: string
  email: string
  password: string
  role?: Roles
}): UserRecord => {
  const timestamp = now()

  return {
    _id: createId(),
    name: name.trim(),
    email: normalizeEmail(email),
    password,
    role,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export const authService = {
  async signIn(data: SignInDTO) {
    const email = normalizeEmail(data.email)

    const user = localDb.findOne<UserRecord>(
      USERS_TABLE,
      (item) => item.email === email,
    )

    if (!user || user.password !== data.password) {
      throw new Error('Invalid email or password')
    }

    createSession(user._id)

    return toUserModel(user)
  },

  async signUp(data: SignOutDTO) {
    const email = normalizeEmail(data.email)

    const existedUser = localDb.findOne<UserRecord>(
      USERS_TABLE,
      (item) => item.email === email,
    )

    if (existedUser) {
      throw new Error('Email already exists')
    }

    const newUser = createUserRecord({
      name: data.name,
      email,
      password: data.password,
    })

    localDb.insertOne<UserRecord>(USERS_TABLE, newUser)

    return toUserModel(newUser)
  },

  async signOut() {
    localDb.clearTable(AUTH_SESSIONS_TABLE)
    return { success: true }
  },

  async getMe(): Promise<User> {
    const session = getCurrentSession()

    if (!session) {
      throw new Error('Unauthorized')
    }

    const user = localDb.findOne<UserRecord>(
      USERS_TABLE,
      (item) => item._id === session.userId,
    )

    if (!user) {
      localDb.clearTable(AUTH_SESSIONS_TABLE)
      throw new Error('Unauthorized')
    }

    return toUserModel(user)
  },
}
