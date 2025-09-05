import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical, Edit, Trash2, Calendar, Clock, User } from 'lucide-react'
import { Task } from '../../types'
import { formatDate, isOverdue, getRelativeDate } from '../../utils/date'
import clsx from 'clsx'
import { Select } from '../ui'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

const TaskCard = ({ task, onUpdate, onDelete, onEdit }: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [menuPos, setMenuPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0})
  const menuBtnRef = useRef<HTMLButtonElement>(null)



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



  const getStatusColor = (status: Task['status']) => {
    const colors = {
      PENDING: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg',
      'IN_PROGRESS': 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg',
      COMPLETED: 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg',
      CANCELLED: 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
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
    <div ref={cardRef} className="group relative bg-gradient-to-br from-red-50 to-red-100/30 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-red-200/80 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
      {/* Priority indicator bar */}
      <div className={clsx(
        "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
        task.priority === 'HIGH' && "bg-gradient-to-r from-red-500 via-red-600 to-red-700",
        task.priority === 'MEDIUM' && "bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500",
        task.priority === 'LOW' && "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600"
      )} />
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none rounded-xl" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center mb-2">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-2 flex-shrink-0" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                {task.title}
              </h3>
            </div>
            {task.description && (
              <div className="ml-3.5">
                <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed line-clamp-3 bg-white/20 dark:bg-gray-700/20 rounded-md px-3 py-2 border border-white/30 dark:border-gray-600/30">
                  {task.description}
                </p>
              </div>
            )}
          </div>

          {/* Status and Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={handleStatusToggle}
              className={clsx(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md border border-white/30 backdrop-blur-sm',
                getStatusColor(task.status)
              )}
            >
              {getStatusText(task.status)}
            </button>

            <div className="relative">
              <button
                ref={menuBtnRef}
                onClick={handleMenuOpen}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm border border-white/20"
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
                  <div className="bg-red-50 dark:bg-gray-800 rounded-xl shadow-2xl border border-red-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        onEdit(task)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-800 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200 font-medium"
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        onDelete(task.id)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center transition-colors duration-200 font-medium"
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
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {task.tags.map((tag) => {
              // Enhanced color scheme for better visual appeal
              const isPending = tag.name.toLowerCase().includes('pending')
              const baseColor = isPending ? '#6B7280' : tag.color
              const lighterColor = isPending ? '#F3F4F6' : `${tag.color}15`
              const borderColor = isPending ? '#D1D5DB' : `${tag.color}40`
              const textColor = isPending ? '#374151' : tag.color
              const shadowColor = isPending ? '#6B728020' : `${tag.color}20`
              
              return (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 hover:shadow-md border"
                  style={{ 
                    backgroundColor: lighterColor,
                    color: textColor,
                    borderColor: borderColor,
                    boxShadow: `0 2px 6px ${shadowColor}`,
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm border border-white/30"
                    style={{ 
                      backgroundColor: baseColor,
                      boxShadow: `0 1px 3px ${baseColor}40`
                    }}
                  />
                  <span className="font-semibold tracking-wide">{tag.name}</span>
                </span>
              )
            })}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            {taskDueDate && (
              <div className="flex items-center bg-white/30 dark:bg-gray-700/30 rounded-lg px-3 py-1.5 border border-white/40 dark:border-gray-600/40">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className={clsx(
                  'font-medium text-sm',
                  isOverdue(taskDueDate) && 'text-red-500 dark:text-red-400'
                )}>
                  {getRelativeDate(taskDueDate)}
                </span>
              </div>
            )}
            <div className="flex items-center bg-white/30 dark:bg-gray-700/30 rounded-lg px-3 py-1.5 border border-white/40 dark:border-gray-600/40">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium text-sm">
                {formatDate(new Date(task.createdAt))}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Selector */}
        <div className="flex items-center justify-between pt-4 border-t border-red-200/60 dark:border-gray-700">
          <div className="flex items-center bg-white/20 dark:bg-gray-700/20 rounded-lg px-3 py-2 border border-white/30 dark:border-gray-600/30">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium mr-3">Priority:</span>
            <Select
              options={[
                { value: 'HIGH', label: 'High' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'LOW', label: 'Low' }
              ]}
              value={task.priority}
              onChange={(value) => handlePriorityChange(value as Task['priority'])}
              variant="priority"
              size="md"
              className="w-36"
            />
          </div>
          
          <div className="flex items-center text-xs text-gray-500 bg-white/20 dark:bg-gray-700/20 rounded-lg px-3 py-1.5 border border-white/30 dark:border-gray-600/30">
            <User className="w-3 h-3 mr-1.5" />
            <span className="font-medium">#{task.id.slice(-6)}</span>
          </div>
        </div>
      </div>


    </div>
  )
}

export default TaskCard