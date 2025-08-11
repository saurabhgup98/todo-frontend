import { useState, useEffect, useCallback } from 'react'
import { tagsAPI } from '../services/api'
import { Tag } from '../types'

interface UseTagsReturn {
  tags: Tag[]
  loading: boolean
  error: string | null
  fetchTags: () => Promise<void>
  createTag: (tagData: { name: string; color?: string }) => Promise<void>
  updateTag: (id: string, updates: Partial<Tag>) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  clearTags: () => void
}

export const useTags = (isAuthenticated: boolean = false): UseTagsReturn => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearTags = useCallback(() => {
    console.log('Clearing tags')
    setTags([])
    setError(null)
  }, [])

  const fetchTags = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await tagsAPI.getTags()
      setTags(response.tags)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTag = useCallback(async (tagData: { name: string; color?: string }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await tagsAPI.createTag(tagData)
      setTags(prev => [...prev, response.tag])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTag = useCallback(async (id: string, updates: Partial<Tag>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await tagsAPI.updateTag(id, updates)
      setTags(prev => prev.map(tag => 
        tag.id === id ? response.tag : tag
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tag')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTag = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await tagsAPI.deleteTag(id)
      setTags(prev => prev.filter(tag => tag.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchTags()
    }
  }, [fetchTags, isAuthenticated])

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    clearTags
  }
}
