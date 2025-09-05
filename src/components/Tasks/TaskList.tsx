import { Task } from '../../types'
import TaskCard from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onEditTask: (task: Task) => void
}

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, onEditTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          No tasks found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {tasks.length === 0 ? 'Create your first task to get started!' : 'Try adjusting your filters.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          <TaskCard
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
          />
        </div>
      ))}
    </div>
  )
}

export default TaskList
