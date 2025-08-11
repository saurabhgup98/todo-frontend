import { useState, useEffect } from 'react'
import { X, Calendar, Tag as Loader2 } from 'lucide-react'
import { Task, Tag } from '../../types'

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

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, task])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`input w-full ${errors.title ? 'border-red-500 ring-red-500' : ''}`}
              placeholder="Enter task title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`input w-full resize-none ${errors.description ? 'border-red-500 ring-red-500' : ''}`}
              placeholder="Enter task description (optional)"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="input w-full"
                disabled={isLoading}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="input w-full"
                disabled={isLoading}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="input w-full pl-12"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Tags
            </label>
            {tags.length > 0 ? (
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus-ring w-4 h-4"
                      disabled={isLoading}
                    />
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{tag.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                No tags available. Create tags in the sidebar.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-lg flex-1 sm:flex-none order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg flex-1 sm:flex-none order-1 sm:order-2 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Saving...
                </>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
