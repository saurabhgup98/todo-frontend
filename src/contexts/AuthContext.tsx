import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const hasToken = authAPI.isAuthenticated()
        
        if (hasToken) {
          try {
            const { user } = await authAPI.getProfile()
            setUser(user)
          } catch (profileError) {
            // Token might be invalid, clear it
            authAPI.logout()
            setUser(null)
          }
        } else {
          console.log('No token found')
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Clear invalid token
        authAPI.logout()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email)
      const { user, token } = await authAPI.login({ email, password })
      console.log('Login successful, token received:', !!token)
      
      // Set user immediately after successful login
      setUser(user)
    } catch (error) {
      // Clear any existing user state on login failure
      setUser(null)
      throw error
    }
  }

  const register = async (email: string, name: string, password: string) => {
    try {
      const { user, token } = await authAPI.register({ email, name, password })
      console.log('Registration successful, token received:', !!token)
      console.log('User data:', user)
      
      // Set user immediately after successful registration
      setUser(user)
    } catch (error) {
      // Clear any existing user state on registration failure
      setUser(null)
      throw error
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const clearAuth = () => {
    authAPI.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    clearAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
