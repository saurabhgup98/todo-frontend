import { Task, Tag } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    createdAt: string
    updatedAt: string
  }
  token: string
}

interface TasksResponse {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface TagsResponse {
  tags: Tag[]
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken')
  console.log('Getting auth token:', token ? 'Token exists' : 'No token')
  return token
}

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  console.log('Setting auth token:', token ? 'Token provided' : 'No token')
  localStorage.setItem('authToken', token)
}

// Helper function to remove auth token
const removeAuthToken = (): void => {
  console.log('Removing auth token')
  localStorage.removeItem('authToken')
}

// Generic API request function for authenticated requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken()
  
  if (!token) {
    console.error('No token found for authenticated request to:', endpoint)
    throw new Error('Access token required')
  }
  
  console.log('Making authenticated request to:', endpoint, 'with token:', token.substring(0, 20) + '...')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API request failed:', response.status, errorData)
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('API request successful:', endpoint)
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Generic API request function for non-authenticated requests (login/register)
const publicApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Authentication API
export const authAPI = {
  register: async (userData: { email: string; name: string; password: string }): Promise<AuthResponse> => {
    console.log('Registering user:', userData.email)
    const response = await publicApiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    console.log('Register response received:', response)
    console.log('Token from register:', response.token ? 'Token exists' : 'No token')
    setAuthToken(response.token)
    console.log('Token stored after register')
    return response
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    console.log('Logging in user:', credentials.email)
    const response = await publicApiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    console.log('Login response received:', response)
    console.log('Token from login:', response.token ? 'Token exists' : 'No token')
    setAuthToken(response.token)
    console.log('Token stored after login')
    
    // Verify token was stored
    const storedToken = localStorage.getItem('authToken')
    console.log('Token verification after storage:', storedToken ? 'Token stored successfully' : 'Token not stored')
    
    return response
  },

  logout: (): void => {
    console.log('Logging out user')
    removeAuthToken()
  },

  getProfile: async (): Promise<{ user: AuthResponse['user'] }> => {
    console.log('Getting user profile')
    return await apiRequest<{ user: AuthResponse['user'] }>('/auth/profile')
  },

  isAuthenticated: (): boolean => {
    const hasToken = !!getAuthToken()
    console.log('Checking authentication:', hasToken ? 'Authenticated' : 'Not authenticated')
    return hasToken
  },
}

// Tasks API
export const tasksAPI = {
  getTasks: async (params: {
    priority?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  } = {}): Promise<TasksResponse> => {
    console.log('Getting tasks with params:', params)
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`
    
    return await apiRequest<TasksResponse>(endpoint)
  },

  getTask: async (id: string): Promise<{ task: Task }> => {
    console.log('Getting task:', id)
    return await apiRequest<{ task: Task }>(`/tasks/${id}`)
  },

  createTask: async (taskData: {
    title: string
    description?: string
    priority?: 'HIGH' | 'MEDIUM' | 'LOW'
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
    tagIds?: string[]
  }): Promise<{ message: string; task: Task }> => {
    console.log('Creating task:', taskData)
    console.log('Current token before creating task:', getAuthToken() ? 'Token exists' : 'No token')
    return await apiRequest<{ message: string; task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  },

  updateTask: async (
    id: string,
    taskData: {
      title?: string
      description?: string
      priority?: 'HIGH' | 'MEDIUM' | 'LOW'
      status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
      dueDate?: string
      tagIds?: string[]
    }
  ): Promise<{ message: string; task: Task }> => {
    console.log('Updating task:', id, taskData)
    console.log('Current token before updating task:', getAuthToken() ? 'Token exists' : 'No token')
    return await apiRequest<{ message: string; task: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    console.log('Deleting task:', id)
    return await apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  },
}

// Tags API
export const tagsAPI = {
  getTags: async (): Promise<TagsResponse> => {
    return await apiRequest<TagsResponse>('/tags')
  },

  getTag: async (id: string): Promise<{ tag: Tag }> => {
    return await apiRequest<{ tag: Tag }>(`/tags/${id}`)
  },

  createTag: async (tagData: { name: string; color?: string }): Promise<{ message: string; tag: Tag }> => {
    return await apiRequest<{ message: string; tag: Tag }>('/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    })
  },

  updateTag: async (
    id: string,
    tagData: { name?: string; color?: string }
  ): Promise<{ message: string; tag: Tag }> => {
    return await apiRequest<{ message: string; tag: Tag }>(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tagData),
    })
  },

  deleteTag: async (id: string): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(`/tags/${id}`, {
      method: 'DELETE',
    })
  },
}

// Health check
export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
    const baseUrl = API_BASE_URL.replace('/api', '')
    return await fetch(`${baseUrl}/health`).then(res => res.json())
  },
}
