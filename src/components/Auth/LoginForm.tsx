import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../ui'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      
      // Provide more specific error messages
      if (errorMessage.includes('Too many requests') || errorMessage.includes('Too many authentication attempts')) {
        setError('Too many login attempts. Please wait 15 minutes before trying again.')
      } else if (errorMessage.includes('Invalid credentials')) {
        setError('Invalid email or password. Please check your credentials.')
      } else if (errorMessage.includes('User not found')) {
        setError('No account found with this email address.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          placeholder="Enter your email"
          required
          disabled={isLoading}
          fullWidth
        />

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full pr-12"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
      <a href="https://todo-backend-cff6.onrender.com/api/auth/google" className="block mt-6">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:shadow-md transition-all duration-150 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          style={{ letterSpacing: 0.2 }}
        >
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.147-3.2-.422-4.704H24.48v9.02h13.02c-.56 2.92-2.24 5.4-4.76 7.08v5.86h7.7c4.52-4.16 7.092-10.28 7.092-17.256z" fill="#4285F4"/><path d="M24.48 48c6.48 0 11.92-2.16 15.88-5.88l-7.7-5.86c-2.16 1.44-4.92 2.28-8.18 2.28-6.28 0-11.6-4.24-13.5-9.96H2.68v6.24C6.64 43.44 14.88 48 24.48 48z" fill="#34A853"/><path d="M10.98 28.58A14.77 14.77 0 0 1 9.36 24c0-1.6.28-3.16.78-4.58v-6.24H2.68A23.98 23.98 0 0 0 0 24c0 3.8.92 7.4 2.68 10.82l8.3-6.24z" fill="#FBBC05"/><path d="M24.48 9.52c3.54 0 6.68 1.22 9.16 3.62l6.84-6.84C36.4 2.16 30.96 0 24.48 0 14.88 0 6.64 4.56 2.68 13.18l8.3 6.24c1.9-5.72 7.22-9.9 13.5-9.9z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><path fill="#fff" d="M0 0h48v48H0z"/></clipPath></defs></svg>
          <span className="text-base font-medium tracking-tight">Continue with Google</span>
        </button>
      </a>
    </div>
  )
}

export default LoginForm