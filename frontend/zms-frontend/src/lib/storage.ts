import type { User } from '../contexts/AuthContext'

const STORAGE_KEYS = {
  AUTH_TOKEN: 'zms-token',
  USER: 'zms-user',
} as const

class StorageService {
  private static instance: StorageService

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  // Auth Token
  setAuthToken(token: string): void {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  removeAuthToken(): void {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  // User
  setUser(user: User): void {
    sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  getUser(): User | null {
    const userStr = sessionStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      return null
    }
  }

  removeUser(): void {
    sessionStorage.removeItem(STORAGE_KEYS.USER)
  }

  // Clear all auth data
  clearAuthData(): void {
    this.removeAuthToken()
    this.removeUser()
  }
}

export const storage = StorageService.getInstance()