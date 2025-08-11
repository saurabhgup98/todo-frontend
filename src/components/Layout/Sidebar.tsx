import { useState } from 'react'
import { Search, Plus, Sun, Moon, LogOut } from 'lucide-react'
import { FilterState, Tag } from '../../types'
import clsx from 'clsx'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  tags: Tag[]
  onAddTag: (tagData: { name: string; color?: string }) => void
  theme?: 'light' | 'dark'
  onThemeToggle?: () => void
  onLogout?: () => void
  user?: {
    id: string
    email: string
    name: string
    createdAt: string
    updatedAt: string
  } | null
}

const Sidebar = ({ 
   filters, 
  onFiltersChange, 
  tags, 
  onAddTag,
  theme = 'light',
  onThemeToggle,
  onLogout,
  user
}: SidebarProps) => {
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6')
  const [showAddTagForm, setShowAddTagForm] = useState(false)

  const handlePriorityChange = (priority: FilterState['priority']) => {
    onFiltersChange({ priority })
  }

  const handleStatusChange = (status: FilterState['status']) => {
    onFiltersChange({ status })
  }

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = filters.selectedTags.includes(tagId)
      ? filters.selectedTags.filter(id => id !== tagId)
      : [...filters.selectedTags, tagId]
    onFiltersChange({ selectedTags: newSelectedTags })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({ search })
  }

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag({
        name: newTagName.trim(),
        color: newTagColor
      })
      setNewTagName('')
      setNewTagColor('#3B82F6')
      setShowAddTagForm(false)
    }
  }

  const priorityOptions = [
    { value: 'all', label: 'All Priorities', color: 'gray' },
    { value: 'HIGH', label: 'High Priority', color: 'red' },
    { value: 'MEDIUM', label: 'Medium Priority', color: 'yellow' },
    { value: 'LOW', label: 'Low Priority', color: 'green' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'PENDING', label: 'Pending', color: 'gray' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue' },
    { value: 'COMPLETED', label: 'Completed', color: 'green' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' }
  ]

  return (
    <>
      {/* Sidebar - Only visible on desktop */}
      <div className={clsx(
        "hidden lg:block fixed inset-y-0 left-0 z-40 w-72 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-soft dark:shadow-soft-dark"
      )}>
        <div 
          className="flex flex-col h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Filters
            </h2>
            <div className="flex items-center space-x-3">
              {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="input w-full pl-12"
                />
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Priority
              </label>
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePriorityChange(option.value as FilterState['priority'])}
                    className={clsx(
                      "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                      filters.priority === option.value
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <div className="flex items-center">
                      <div className={clsx(
                        "w-3 h-3 rounded-full mr-3 shadow-sm",
                        option.color === 'red' && "bg-red-500",
                        option.color === 'yellow' && "bg-yellow-500",
                        option.color === 'green' && "bg-green-500",
                        option.color === 'gray' && "bg-gray-400"
                      )} />
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value as FilterState['status'])}
                    className={clsx(
                      "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                      filters.status === option.value
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <button
                  onClick={() => setShowAddTagForm(!showAddTagForm)}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add Tag Form */}
              {showAddTagForm && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="input w-full"
                    />
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer shadow-sm"
                      />
                      <button
                        onClick={handleAddTag}
                        disabled={!newTagName.trim()}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        Add Tag
                      </button>
                      <button
                        onClick={() => setShowAddTagForm(false)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {tags.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center",
                        filters.selectedTags.includes(tag.id)
                          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-3 shadow-sm"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  No tags yet. Create your first tag!
                </p>
              )}
            </div>
          </div>

          {/* Logout Section - Only visible on desktop */}
          {onLogout && user && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 lg:block hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring ml-3"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
