import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  variant?: 'default' | 'priority' | 'status'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  className?: string
}

const Select = ({ 
  options, 
  value, 
  onChange, 
  label, 
  error, 
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className,
  ...props 
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: "h-10 px-3 py-2 text-xs",
    md: "h-11 px-4 py-2.5 text-sm",
    lg: "h-12 px-5 py-3 text-base"
  }

  const widthClasses = fullWidth ? "w-full" : ""

  const getSelectedOption = () => {
    return options.find(option => option.value === value)
  }

  const selectedOption = getSelectedOption()

  // Get priority colors
  const getPriorityColor = (priority: string) => {
    const colors = {
      HIGH: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', border: 'border-red-200' },
      MEDIUM: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200' },
      LOW: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', border: 'border-green-200' }
    }
    return colors[priority as keyof typeof colors] || { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-200' }
  }

  // Get status colors
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: { bg: 'bg-gray-500', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200' },
      'IN_PROGRESS': { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200' },
      COMPLETED: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', border: 'border-green-200' },
      CANCELLED: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', border: 'border-red-200' }
    }
    return colors[status as keyof typeof colors] || { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-200' }
  }

  const handleToggle = () => {
    if (loading || props.disabled) return
    
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          triggerRef.current && 
          !triggerRef.current.contains(event.target as Node) &&
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className={clsx("relative", widthClasses, className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className={clsx(
          "relative flex items-center justify-between w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          sizeClasses[size],
          loading && "opacity-50 cursor-not-allowed",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

                 {/* Selected Value */}
         <div className={clsx(
           "flex items-center space-x-2 flex-1",
           icon && "pl-12"
         )}>
           {selectedOption && (
             <>
               {/* Priority/Status Dot */}
               {(variant === 'priority' || variant === 'status') && (
                 <div className={clsx(
                   "w-3 h-3 rounded-full border border-white shadow-sm",
                   variant === 'priority' && getPriorityColor(selectedOption.value).bg,
                   variant === 'status' && getStatusColor(selectedOption.value).bg
                 )} />
               )}
               
               {/* Label */}
               <span className={clsx(
                 "font-medium",
                 variant === 'priority' && getPriorityColor(selectedOption.value).text,
                 variant === 'status' && getStatusColor(selectedOption.value).text,
                 variant === 'default' && "text-gray-900 dark:text-white"
               )}>
                 {selectedOption.label}
               </span>
             </>
           )}
         </div>

                 {/* Arrow Icon */}
         <div className={clsx(
           "flex items-center justify-center transition-transform duration-200",
           isOpen && "rotate-180"
         )}>
           <div className="p-0.5 rounded-full bg-gray-100 dark:bg-gray-600">
             <svg 
               className={clsx(
                 "text-gray-500 dark:text-gray-400",
                 size === 'sm' && "w-3 h-3",
                 size === 'md' && "w-4 h-4", 
                 size === 'lg' && "w-5 h-5"
               )} 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24"
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
             </svg>
           </div>
         </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 10000
          }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in"
        >
                     <div className="py-1 max-h-48 overflow-y-auto">
             {options.map((option) => {
               const isSelected = option.value === value
               const colors = variant === 'priority' 
                 ? getPriorityColor(option.value)
                 : variant === 'status' 
                   ? getStatusColor(option.value)
                   : { bg: 'bg-gray-500', text: 'text-gray-900 dark:text-white', border: 'border-gray-200' }

               return (
                 <div
                   key={option.value}
                   onClick={() => handleOptionClick(option.value)}
                   className={clsx(
                     "flex items-center space-x-2 px-3 py-2 cursor-pointer transition-all duration-150",
                     isSelected 
                       ? "bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500" 
                       : "hover:bg-gray-50 dark:hover:bg-gray-700"
                   )}
                 >
                   {/* Priority/Status Dot */}
                   {(variant === 'priority' || variant === 'status') && (
                     <div className={clsx(
                       "w-3 h-3 rounded-full border border-white shadow-sm",
                       colors.bg
                     )} />
                   )}
                   
                   {/* Label */}
                   <span className={clsx(
                     "text-sm font-medium",
                     isSelected 
                       ? "text-primary-600 dark:text-primary-400 font-semibold" 
                       : colors.text
                   )}>
                     {option.label}
                   </span>

                   {/* Selected Checkmark */}
                   {isSelected && (
                     <div className="ml-auto">
                       <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                     </div>
                   )}
                 </div>
               )
             })}
           </div>
        </div>,
        document.body
      )}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-2">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
