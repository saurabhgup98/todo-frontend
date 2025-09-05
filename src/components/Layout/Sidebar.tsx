import { useState } from 'react'
import { Search, Plus, Sun, Moon, LogOut, ChevronLeft, Filter, Menu } from 'lucide-react'
import { FilterState, Tag } from '../../types'
import clsx from 'clsx'
import { Button, Input } from '../ui'

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
  onMinimizeChange?: (isMinimized: boolean) => void
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
  onMinimizeChange,
  user
}: SidebarProps) => {
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6')
  const [showAddTagForm, setShowAddTagForm] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)

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

  const toggleMinimize = () => {
    const newMinimizedState = !isMinimized
    setIsMinimized(newMinimizedState)
    onMinimizeChange?.(newMinimizedState)
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

  // Count active filters
  const activeFiltersCount = [
    filters.search && 1,
    filters.priority !== 'all' && 1,
    filters.status !== 'all' && 1,
    filters.selectedTags.length > 0 && 1
  ].filter(Boolean).length

  return (
    <>
      {/* Sidebar - Only visible on desktop */}
      <div className={clsx(
        "hidden lg:block fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-soft dark:shadow-soft-dark transition-all duration-300 ease-in-out",
        isMinimized ? "w-20" : "w-72"
      )}>
        <div 
          className="flex flex-col h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            {!isMinimized ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Filters
                    </h2>
                    {activeFiltersCount > 0 && (
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                        {activeFiltersCount} active
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {onThemeToggle && (
                    <button
                      onClick={onThemeToggle}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
                      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                      {theme === 'light' ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={toggleMinimize}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
                    title="Minimize sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                {/* Hamburger Menu Button */}
                <button
                  onClick={toggleMinimize}
                  className="p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring shadow-lg border border-gray-200 dark:border-gray-600"
                  title="Expand sidebar"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                {/* Active Filters Indicator */}
                {activeFiltersCount > 0 && (
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white dark:border-gray-800">
                    {activeFiltersCount}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Search */}
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  label="Search Tasks"
                  icon={<Search className="w-4 h-4" />}
                  variant="search"
                  fullWidth
                />
              </div>

              {/* Priority Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Priority Level
                </label>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePriorityChange(option.value as FilterState['priority'])}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-transparent",
                        filters.priority === option.value
                          ? "bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                      )}
                    >
                      <div className="flex items-center">
                        <div className={clsx(
                          "w-3 h-3 rounded-full mr-3 shadow-sm",
                          option.color === 'red' && "bg-gradient-to-r from-red-500 to-red-600",
                          option.color === 'yellow' && "bg-gradient-to-r from-yellow-500 to-yellow-600",
                          option.color === 'green' && "bg-gradient-to-r from-green-500 to-green-600",
                          option.color === 'gray' && "bg-gradient-to-r from-gray-400 to-gray-500"
                        )} />
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Task Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value as FilterState['status'])}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-transparent",
                        filters.status === option.value
                          ? "bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  <button
                    onClick={() => setShowAddTagForm(!showAddTagForm)}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
                    title="Add new tag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add Tag Form */}
                {showAddTagForm && (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Enter tag name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        fullWidth
                      />
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        />
                        <Button
                          onClick={handleAddTag}
                          disabled={!newTagName.trim()}
                          size="sm"
                          className="flex-1"
                        >
                          Add Tag
                        </Button>
                        <Button
                          onClick={() => setShowAddTagForm(false)}
                          variant="secondary"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {tags.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={clsx(
                          "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center border border-transparent",
                          filters.selectedTags.includes(tag.id)
                            ? "bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700 shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      No tags yet. Create your first tag!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Logout Section - Only visible on desktop when expanded */}
          {onLogout && user && !isMinimized && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 lg:block hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
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
