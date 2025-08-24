import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { storage } from '../lib/storage'

export interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  setUserAndToken: (user: User | null, token:string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = storage.getAuthToken()
    const savedUser = storage.getUser()

    if (savedToken && savedUser) {
      setUserState(savedUser)
    }
    setLoading(false)

    // Listen for logout events from HTTP client
    const handleLogout = () => {
      setUserState(null)
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const setUserAndToken = (user: User | null, token:string) => {
    storage.setAuthToken(token)
    storage.setUser(user!)
    setUserState(user)
  }

  const signOut = () => {
    setUserState(null)
    storage.clearAuthData()
  }

  const value: AuthContextType = {
    user,
    loading,
    setUserAndToken,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}