import { ReactNode, SelectHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SelectOption {
  value: string
  label: string
  color?: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  variant?: 'default' | 'priority' | 'status'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  error?: string
  icon?: ReactNode
}

const Select = ({ 
  options, 
  value, 
  onChange, 
  label, 
  placeholder,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  error,
  icon,
  className,
  ...props 
}: SelectProps) => {
  const baseClasses = "flex w-full rounded-lg border bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:pointer-events-none appearance-none"
  
  const variantClasses = {
    default: "border-gray-300 dark:border-gray-600",
    priority: "border-gray-300 dark:border-gray-600",
    status: "border-gray-300 dark:border-gray-600"
  }
  
  const sizeClasses = {
    sm: "h-9 px-3 py-2 text-xs",
    md: "h-11 px-4 py-3 text-sm",
    lg: "h-14 px-6 py-4 text-base"
  }
  
  const widthClasses = fullWidth ? "w-full" : ""
  
  const getPriorityColor = (value: string) => {
    const colors = {
      HIGH: 'bg-priority-high text-white',
      MEDIUM: 'bg-priority-medium text-white',
      LOW: 'bg-priority-low text-white'
    }
    return colors[value as keyof typeof colors] || ''
  }
  
  const getStatusColor = (value: string) => {
    const colors = {
      PENDING: 'bg-status-pending text-white',
      'IN_PROGRESS': 'bg-status-in-progress text-white',
      COMPLETED: 'bg-status-completed text-white',
      CANCELLED: 'bg-status-cancelled text-white'
    }
    return colors[value as keyof typeof colors] || ''
  }

  return (
    <div className={clsx("space-y-2", widthClasses)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {icon}
          </div>
        )}
        
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            icon && "pl-12",
            error && "border-red-300 dark:border-red-600 focus:ring-red-500",
            className
          )}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              className={clsx(
                variant === 'priority' && getPriorityColor(option.value),
                variant === 'status' && getStatusColor(option.value)
              )}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
