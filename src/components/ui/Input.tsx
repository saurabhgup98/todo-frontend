import { ReactNode, InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import Calendar from './Calendar'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  fullWidth?: boolean
  variant?: 'default' | 'search'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  icon, 
  fullWidth = false,
  variant = 'default',
  className,
  ...props 
}, ref) => {
  const baseClasses = "flex w-full rounded-xl border bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
  
  const variantClasses = {
    default: "border-gray-300 dark:border-gray-600",
    search: "border-gray-300 dark:border-gray-600"
  }
  
  const sizeClasses = "h-12 px-4 py-3 text-sm"
  
  
  const widthClasses = fullWidth ? "w-full" : ""
  
  // If it's a date input, use our custom Calendar component
  if (props.type === 'date') {
    return (
      <div className={clsx("space-y-2", widthClasses)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <Calendar
          value={props.value as string}
          onChange={(date) => {
            const event = {
              target: { value: date }
            } as React.ChangeEvent<HTMLInputElement>;
            props.onChange?.(event);
          }}
          placeholder={props.placeholder || "Select date"}
          className={className}
          disabled={props.disabled}
        />
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        )}
      </div>
    );
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
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={clsx(
            baseClasses,
            variantClasses[variant],
            sizeClasses,
            icon && "pl-12",
            error && "border-red-300 dark:border-red-600 focus:ring-red-500",
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
