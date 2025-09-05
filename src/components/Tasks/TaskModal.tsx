import { useState, useEffect } from 'react'
import { X, Calendar } from 'lucide-react'
import { Task, Tag } from '../../types'
import { Button, Select, Input } from '../ui'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: {
    title: string
    description?: string
    priority?: 'HIGH' | 'MEDIUM' | 'LOW'
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
    tagIds?: string[]
  }) => void
  task?: Task | null
  tags: Tag[]
  isLoading?: boolean
}

const TaskModal = ({ isOpen, onClose, onSubmit, task, tags, isLoading = false }: TaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    dueDate: '',
    tagIds: [] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isAnimating, setIsAnimating] = useState(false)

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      if (task) {
        // Edit mode
        setFormData({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          tagIds: task.tags?.map(tag => tag.id) || []
        })
      } else {
        // Add mode
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'PENDING',
          dueDate: '',
          tagIds: []
        })
      }
      setErrors({})
    } else {
      setIsAnimating(false)
    }
  }, [isOpen, task])

  // Function to capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const handleChange = (field: string, value: string | Date | string[]) => {
    let processedValue = value
    
    // Apply capitalization for title and description
    if (field === 'title' && typeof value === 'string') {
      processedValue = capitalizeWords(value)
    } else if (field === 'description' && typeof value === 'string') {
      processedValue = capitalizeWords(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters'
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined
    }

    onSubmit(taskData)
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] transform transition-all duration-300 ease-out ${
          isAnimating 
            ? 'translate-y-0 scale-100 opacity-100' 
            : '-translate-y-8 scale-95 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-primary-100 text-sm mt-1">
                {task ? 'Update your task details' : 'Add a new task to your list'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Title */}
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            label="Task Title *"
            placeholder="Enter a descriptive title for your task"
            disabled={isLoading}
            error={errors.title}
            fullWidth
          />

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.description ? 'border-red-300 ring-red-500' : ''
              }`}
              placeholder="Add details about your task (optional)"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              options={[
                { value: 'LOW', label: 'Low Priority' },
                { value: 'MEDIUM', label: 'Medium Priority' },
                { value: 'HIGH', label: 'High Priority' }
              ]}
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
              label="Priority Level"
              variant="priority"
              disabled={isLoading}
            />

            <Select
              options={[
                { value: 'PENDING', label: 'Pending' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' }
              ]}
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              label="Status"
              variant="status"
              disabled={isLoading}
            />
          </div>

          {/* Due Date */}
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            label="Due Date"
            icon={<Calendar className="w-4 h-4" />}
            disabled={isLoading}
            fullWidth
          />

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Tags
            </label>
            {tags.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 custom-scrollbar">
                {tags.map((tag) => {
                  const isSelected = formData.tagIds.includes(tag.id)
                  const isPending = tag.name.toLowerCase().includes('pending')
                  const baseColor = isPending ? '#6B7280' : tag.color
                  const lighterColor = isSelected 
                    ? (isPending ? '#E5E7EB' : `${tag.color}20`)
                    : 'transparent'
                  const borderColor = isSelected 
                    ? (isPending ? '#9CA3AF' : `${tag.color}50`)
                    : 'transparent'
                  const textColor = isSelected 
                    ? (isPending ? '#374151' : tag.color)
                    : (isPending ? '#6B7280' : tag.color)
                  
                  return (
                    <label 
                      key={tag.id} 
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all duration-200 border ${
                        isSelected 
                          ? 'shadow-sm' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                      style={isSelected ? {
                        backgroundColor: lighterColor,
                        borderColor: borderColor
                      } : {}}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTagToggle(tag.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus-ring w-4 h-4"
                        disabled={isLoading}
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        <div
                          className="w-3 h-3 rounded-full shadow-sm border border-white/50"
                          style={{ 
                            backgroundColor: baseColor,
                            boxShadow: `0 1px 3px ${baseColor}40`
                          }}
                        />
                        <span 
                          className={`text-sm font-semibold tracking-wide ${
                            isSelected 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                          style={isSelected ? { color: textColor } : {}}
                        >
                          {tag.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm" 
                          style={{ 
                            backgroundColor: baseColor,
                            boxShadow: `0 2px 4px ${baseColor}40`
                          }}
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </label>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
                  No tags available. Create tags in the sidebar.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleClose}
              className="flex-1 sm:flex-none order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              className="flex-1 sm:flex-none order-1 sm:order-2"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default TaskModal