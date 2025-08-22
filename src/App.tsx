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
import { Plus,TrendingUp } from 'lucide-react'
import { Button } from './components/ui'

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
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true)
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

  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length
  const pendingTasks = tasks.filter(task => task.status === 'PENDING').length
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length
  const totalTasks = tasks.length

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 dark:border-t-primary-600 rounded-full animate-ping mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Todo App</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we set up your workspace...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-400 to-green-600 dark:from-green-500 dark:via-green-400 dark:to-green-600 transition-colors duration-200 overflow-x-hidden custom-scrollbar">
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
          onMinimizeChange={setIsSidebarMinimized}
          user={user}
        />
        
        {/* Main Content */}
        <main className={`flex-1 min-h-screen lg:pt-8 pt-20 overflow-x-hidden transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-72'}`}>
          {/* Content Container */}
          <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-3 lg:py-4">
            {/* Header Section */}
            <div className="mb-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg shadow-sm">
                    <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                      My Tasks
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Welcome back, {user?.name}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  size="md"
                  icon={<Plus className="w-4 h-4" />}
                  className="shadow-md hover:shadow-lg"
                >
                  Create Task
                </Button>
              </div>
              
              {/* Compact Task Statistics */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{pendingTasks}</span> pending
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{inProgressTasks}</span> in progress
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{completedTasks}</span> completed
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{totalTasks}</span> total
                  </span>
                </div>
              </div>
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
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary-400 dark:border-t-primary-600 rounded-full animate-ping mx-auto"></div>
                  </div>
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">Loading your tasks...</span>
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

            {/* Empty state */}
            {!tasksLoading && tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first task to get started!</p>
                <Button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  size="lg"
                  icon={<Plus className="w-5 h-5" />}
                >
                  Create Your First Task
                </Button>
              </div>
            )}
          </div>
        </main>
      </Layout>

      {/* Mobile Add Task Button */}
      <Button
        onClick={() => setIsAddTaskModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 p-4 rounded-full shadow-2xl hover:shadow-3xl z-40"
        title="Add Task"
      >
        <Plus className="w-6 h-6" />
      </Button>

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
