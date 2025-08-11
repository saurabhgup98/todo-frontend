import { Menu, Sun, Moon, LogOut, Filter } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  onThemeToggle: () => void
  onFilterClick?: () => void
  theme: 'light' | 'dark'
  user?: {
    id: string
    email: string
    name: string
    createdAt: string
    updatedAt: string
  } | null
  onLogout: () => void
}

const Header = ({ onMenuClick, onThemeToggle, onFilterClick, theme, user, onLogout }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden shadow-soft dark:shadow-soft-dark z-40 overflow-x-hidden">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4 max-w-full">
        <button
          onClick={onMenuClick}
          className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3 lg:space-x-6 min-w-0 flex-1 justify-end">
          <div className="text-right hidden sm:block">
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">Todo App</h1>
            {user && (
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">{user.name}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {onFilterClick && (
              <button
                onClick={onFilterClick}
                className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
                title="Filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onThemeToggle}
              className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {user && onLogout && (
              <button
                onClick={onLogout}
                className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
