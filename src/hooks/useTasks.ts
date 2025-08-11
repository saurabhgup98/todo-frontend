import { useState, useEffect, useCallback } from 'react'
import { tasksAPI } from '../services/api'
import { Task } from '../types'

interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  fetchTasks: (params?: {
    priority?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  }) => Promise<void>
  createTask: (taskData: {
    title: string
    description?: string
    priority?: 'HIGH' | 'MEDIUM' | 'LOW'
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
    tagIds?: string[]
  }) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  clearTasks: () => void
}

export const useTasks = (isAuthenticated: boolean = false): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const clearTasks = useCallback(() => {
    console.log('Clearing tasks')
    setTasks([])
    setError(null)
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    })
  }, [])

  const fetchTasks = useCallback(async (params: {
    priority?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  } = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await tasksAPI.getTasks(params)
      setTasks(response.tasks)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (taskData: {
    title: string
    description?: string
    priority?: 'HIGH' | 'MEDIUM' | 'LOW'
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
    tagIds?: string[]
  }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await tasksAPI.createTask(taskData)
      setTasks(prev => [response.task, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setLoading(true)
    setError(null)

    try {
      // Filter out fields that shouldn't be sent to the backend
      const allowedFields = ['title', 'description', 'priority', 'status', 'dueDate', 'tagIds']
      const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = updates[key as keyof Task]
        }
        return acc
      }, {} as any)

      console.log('Updating task with filtered data:', filteredUpdates)
      const response = await tasksAPI.updateTask(id, filteredUpdates)
      setTasks(prev => prev.map(task => 
        task.id === id ? response.task : task
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await tasksAPI.deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    }
  }, [fetchTasks, isAuthenticated])

  return {
    tasks,
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearTasks
  }
}
