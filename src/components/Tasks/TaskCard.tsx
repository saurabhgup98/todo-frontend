import { useState, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical, Edit, Trash2, Calendar, Tag as TagIcon } from 'lucide-react'
import { Task } from '../../types'
import { formatDate, isOverdue, getRelativeDate } from '../../utils/date'
import clsx from 'clsx'
import TaskModal from './TaskModal'

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
      HIGH: 'bg-priority-high text-white',
      MEDIUM: 'bg-priority-medium text-white',
      LOW: 'bg-priority-low text-white'
    }
    return colors[priority]
  }

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      PENDING: 'bg-status-pending text-white',
      'IN_PROGRESS': 'bg-status-in-progress text-white',
      COMPLETED: 'bg-status-completed text-white',
      CANCELLED: 'bg-status-cancelled text-white'
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
      setMenuPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
    setShowMenu(true)
  }

  return (
    <div ref={cardRef} className="card hover-lift p-4 lg:p-6 mb-4 group overflow-hidden relative">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
          <button
            onClick={handleStatusToggle}
            className={clsx(
              'badge text-xs px-2 lg:px-3 py-1 lg:py-1.5 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 font-medium whitespace-nowrap',
              getStatusColor(task.status)
            )}
          >
            {getStatusText(task.status)}
          </button>

          <div className="relative">
            <button
              ref={menuBtnRef}
              onClick={handleMenuOpen}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && typeof window !== 'undefined' && createPortal(
              <div style={{
                position: 'absolute',
                top: menuPos.top,
                left: menuPos.left,
                width: 192, // w-48
                zIndex: 10000
              }}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft dark:shadow-soft-dark border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      setIsEditPopoverOpen(true)
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      onDelete(task.id)
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Delete
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 gap-2">
        <div className="flex items-center space-x-4 lg:space-x-6 flex-wrap">
          {taskDueDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className={clsx(
                'font-medium text-xs lg:text-sm',
                isOverdue(taskDueDate) && 'text-red-500 dark:text-red-400'
              )}>
                {getRelativeDate(taskDueDate)}
              </span>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center">
              <TagIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="font-medium text-xs lg:text-sm">{task.tags.length} tag{task.tags.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {formatDate(new Date(task.createdAt))}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-2 flex-wrap gap-2 min-w-0">
          {task.tags && task.tags.map((tag) => (
            <span
              key={tag.id}
              className="badge text-xs px-2 lg:px-3 py-1 lg:py-1.5 font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 whitespace-nowrap"
              style={{ backgroundColor: tag.color, color: 'white' }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Priority:</span>
          <select
            value={task.priority}
            onChange={(e) => handlePriorityChange(e.target.value as Task['priority'])}
            className={clsx(
              'text-xs px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg border-0 text-white cursor-pointer font-medium transition-all duration-200 hover:scale-105 focus-ring whitespace-nowrap',
              getPriorityColor(task.priority)
            )}
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>
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