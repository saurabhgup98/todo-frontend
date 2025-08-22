import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical, Edit, Trash2, Calendar, Tag as TagIcon, Clock, User } from 'lucide-react'
import { Task } from '../../types'
import { formatDate, isOverdue, getRelativeDate } from '../../utils/date'
import clsx from 'clsx'
import TaskModal from './TaskModal'
import { Select } from '../ui'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  tags: any[]
}

const TaskCard = ({ task, onUpdate, onDelete, tags }: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0})
  const cardRef = useRef<HTMLDivElement>(null)
  const [menuPos, setMenuPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0})
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    if (isEditPopoverOpen && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setPopoverPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [isEditPopoverOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && menuBtnRef.current && !menuBtnRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleStatusToggle = () => {
    const statusMap = {
      'PENDING': 'IN_PROGRESS',
      'IN_PROGRESS': 'COMPLETED',
      'COMPLETED': 'PENDING',
      'CANCELLED': 'PENDING'
    } as const
    
    const newStatus = statusMap[task.status]
    onUpdate(task.id, { status: newStatus })
  }

  const handlePriorityChange = (priority: Task['priority']) => {
    onUpdate(task.id, { priority })
  }

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      HIGH: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      MEDIUM: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
      LOW: 'bg-gradient-to-r from-green-500 to-green-600 text-white'
    }
    return colors[priority]
  }

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      PENDING: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
      'IN_PROGRESS': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      COMPLETED: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      CANCELLED: 'bg-gradient-to-r from-red-500 to-red-600 text-white'
    }
    return colors[status]
  }

  const getStatusText = (status: Task['status']) => {
    const texts = {
      PENDING: 'Pending',
      'IN_PROGRESS': 'In Progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled'
    }
    return texts[status]
  }

  const taskDueDate = task.dueDate ? new Date(task.dueDate) : null

  const handleMenuOpen = () => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const menuWidth = 200 // Approximate menu width
      
      // Calculate position to ensure menu doesn't go off-screen
      let left = rect.left + window.scrollX
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 20 // 20px margin from edge
      }
      
      setMenuPos({
        top: rect.bottom + window.scrollY,
        left: left,
        width: menuWidth
      })
    }
    setShowMenu(true)
  }

  return (
    <div ref={cardRef} className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Priority indicator bar */}
      <div className={clsx(
        "absolute top-0 left-0 right-0 h-1",
        task.priority === 'HIGH' && "bg-gradient-to-r from-red-500 to-red-600",
        task.priority === 'MEDIUM' && "bg-gradient-to-r from-yellow-500 to-yellow-600",
        task.priority === 'LOW' && "bg-gradient-to-r from-green-500 to-green-600"
      )} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {task.description}
              </p>
            )}
          </div>

          {/* Status and Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={handleStatusToggle}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm',
                getStatusColor(task.status)
              )}
            >
              {getStatusText(task.status)}
            </button>

            <div className="relative">
              <button
                ref={menuBtnRef}
                onClick={handleMenuOpen}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && typeof window !== 'undefined' && createPortal(
                <div 
                  style={{
                    position: 'absolute',
                    top: menuPos.top,
                    left: menuPos.left,
                    width: menuPos.width,
                    zIndex: 10000
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        setIsEditPopoverOpen(true)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        onDelete(task.id)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete Task
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center space-x-2 flex-wrap gap-2 mb-4">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-105 border border-white/20"
                style={{ 
                  backgroundColor: tag.color, 
                  color: 'white',
                  boxShadow: `0 2px 8px ${tag.color}40`
                }}
              >
                <TagIcon className="w-3 h-3 mr-1.5" />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            {taskDueDate && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className={clsx(
                  'font-medium',
                  isOverdue(taskDueDate) && 'text-red-500 dark:text-red-400'
                )}>
                  {getRelativeDate(taskDueDate)}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">
                {formatDate(new Date(task.createdAt))}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Selector */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-3">Priority:</span>
            <Select
              options={[
                { value: 'HIGH', label: 'High' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'LOW', label: 'Low' }
              ]}
              value={task.priority}
              onChange={(value) => handlePriorityChange(value as Task['priority'])}
              variant="priority"
              size="sm"
              className="w-28"
            />
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <User className="w-3 h-3 mr-1" />
            <span>Task #{task.id.slice(-6)}</span>
          </div>
        </div>
      </div>

      {/* Edit Modal Portal */}
      {isEditPopoverOpen && typeof window !== 'undefined' && createPortal(
        <div style={{
          position: 'absolute',
          top: popoverPos.top,
          left: popoverPos.left,
          width: popoverPos.width,
          zIndex: 9999
        }}>
          <TaskModal
            isOpen={true}
            onClose={() => setIsEditPopoverOpen(false)}
            task={task}
            onSubmit={(taskData: Partial<Task>) => {
              onUpdate(task.id, taskData)
              setIsEditPopoverOpen(false)
            }}
            tags={tags}
          />
        </div>,
        document.body
      )}
    </div>
  )
}

export default TaskCard