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
        console.log('Initializing auth...')
        const hasToken = authAPI.isAuthenticated()
        console.log('Has token:', hasToken)
        
        if (hasToken) {
          console.log('Token found, fetching user profile...')
          try {
            const { user } = await authAPI.getProfile()
            console.log('User profile fetched:', user)
            setUser(user)
          } catch (profileError) {
            console.error('Failed to fetch profile with existing token:', profileError)
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
      console.log('User data:', user)
      
      // Set user immediately after successful login
      setUser(user)
      console.log('User set in context after login')
    } catch (error) {
      console.error('Login failed:', error)
      // Clear any existing user state on login failure
      setUser(null)
      throw error
    }
  }

  const register = async (email: string, name: string, password: string) => {
    try {
      console.log('Attempting registration for:', email)
      const { user, token } = await authAPI.register({ email, name, password })
      console.log('Registration successful, token received:', !!token)
      console.log('User data:', user)
      
      // Set user immediately after successful registration
      setUser(user)
      console.log('User set in context after registration')
    } catch (error) {
      console.error('Registration failed:', error)
      // Clear any existing user state on registration failure
      setUser(null)
      throw error
    }
  }

  const logout = () => {
    console.log('Logging out...')
    authAPI.logout()
    setUser(null)
  }

  const clearAuth = () => {
    console.log('Clearing auth...')
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
