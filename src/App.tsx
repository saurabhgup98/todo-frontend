import { useState, useEffect } from 'react'
import { FilterState, Theme, Task } from './types'
import { getTheme, setTheme } from './utils/theme'
import { useAuth } from './contexts/AuthContext'
import { useTasks } from './hooks/useTasks'
import { useTags } from './hooks/useTags'
import Layout from './components/Layout/Layout'
import TaskList from './components/Tasks/TaskList'
import TaskModal from './components/Tasks/TaskModal'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import MobileFilterModal from './components/Layout/MobileFilterModal'
import AuthPage from './components/Auth/AuthPage'
import { Plus, Loader2 } from 'lucide-react'

function App() {
  
  const { user, isAuthenticated, isLoading: authLoading, clearAuth } = useAuth()
  const { tasks, loading: tasksLoading, error: tasksError, fetchTasks, createTask, updateTask, deleteTask, clearTasks } = useTasks(isAuthenticated)
  const { tags, error: tagsError, createTag, clearTags } = useTags(isAuthenticated)
  
  const [theme, setThemeState] = useState<Theme>({ mode: getTheme() })
  const [filters, setFilters] = useState<FilterState>({
    priority: 'all',
    status: 'all',
    search: '',
    selectedTags: []
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    setTheme(theme.mode)
  }, [theme.mode])

  // Clear tasks and tags when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, clearing data')
      clearTasks()
      clearTags()
    }
  }, [isAuthenticated, clearTasks, clearTags])

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light'
    setThemeState({ mode: newMode })
  }

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Fetch tasks with new filters
    fetchTasks({
      priority: updatedFilters.priority !== 'all' ? updatedFilters.priority : undefined,
      status: updatedFilters.status !== 'all' ? updatedFilters.status : undefined,
      search: updatedFilters.search || undefined
    })
  }

  const handleAddTask = async (taskData: {
    title: string
    description?: string
    priority?: 'HIGH' | 'MEDIUM' | 'LOW'
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
    tagIds?: string[]
  }) => {
    try {
      console.log('Creating task with data:', taskData)
      await createTask(taskData)
      console.log('Task created successfully')
      setIsAddTaskModalOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleUpdateTask = async (id: string, updates: Partial<typeof tasks[0]>) => {
    try {
      await updateTask(id, updates)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleAddTag = async (tagData: { name: string; color?: string }) => {
    try {
      await createTag(tagData)
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const handleLogout = () => {
    clearAuth()
    clearTasks()
    clearTags()
    setIsSidebarOpen(false)
    setIsMobileFilterOpen(false)
  }

  const handleMobileFilterClick = () => {
    setIsMobileFilterOpen(true)
  }

  // Handler to open edit modal from TaskCard
  const handleOpenEditTaskModal = (task: Task) => {
    setEditTask(task);
    setIsEditTaskModalOpen(true);
  };

  // Handler to submit edit
  const handleEditTaskSubmit = (taskData: Partial<Task>) => {
    if (editTask) {
      handleUpdateTask(editTask.id, taskData);
      setIsEditTaskModalOpen(false);
      setEditTask(null);
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600 dark:text-primary-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show authentication page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-x-hidden">
      {/* Mobile Header - Always visible on mobile, positioned above everything */}
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onThemeToggle={toggleTheme}
        onFilterClick={handleMobileFilterClick}
        theme={theme.mode}
        user={user}
        onLogout={handleLogout}
      />
      
      <Layout>
        {/* Desktop Sidebar - Only visible on desktop */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          tags={tags}
          onAddTag={handleAddTag}
          theme={theme.mode}
          onThemeToggle={toggleTheme}
          onLogout={handleLogout}
          user={user}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen lg:ml-72 lg:pt-8 pt-20 overflow-x-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Tasks
              </h1>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 font-medium">
                Welcome back, {user?.name}!
              </p>
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl lg:flex items-center hidden"
            >
              <Plus className="w-5 h-5 mr-3" />
              Add Task
            </button>
            
            {/* Mobile Add Task Button */}
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="btn btn-primary p-3 rounded-full shadow-lg hover:shadow-xl lg:hidden fixed bottom-6 right-6 z-40"
              title="Add Task"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Error messages */}
          {tasksError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-xl mb-6 font-medium shadow-sm">
              {tasksError}
            </div>
          )}
          {tagsError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-xl mb-6 font-medium shadow-sm">
              {tagsError}
            </div>
          )}

          {/* Loading state */}
          {tasksLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">Loading tasks...</span>
              </div>
            </div>
          )}

          {/* Task list */}
          {!tasksLoading && (
            <TaskList 
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              tags={tags}
              onEditTask={handleOpenEditTaskModal}
            />
          )}
        </main>
      </Layout>

      <TaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
        tags={tags}
        isLoading={tasksLoading}
      />

      <TaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => { setIsEditTaskModalOpen(false); setEditTask(null); }}
        task={editTask}
        onSubmit={handleEditTaskSubmit}
        tags={tags}
      />

      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        tags={tags}
        onAddTag={handleAddTag}
        theme={theme.mode}
        onThemeToggle={toggleTheme}
      />
    </div>
  )
}

export default App
