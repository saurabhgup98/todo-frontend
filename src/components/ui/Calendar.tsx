import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface CalendarProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const inputRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Get calendar position
  const getCalendarPosition = () => {
    if (!inputRef.current) return { top: 0, left: 0 };
    
    const rect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const calendarHeight = 320; // Approximate calendar height
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // If there's not enough space below, position above the input
    const shouldPositionAbove = spaceBelow < calendarHeight && spaceAbove > calendarHeight;
    
    return {
      top: shouldPositionAbove 
        ? rect.top + window.scrollY - calendarHeight - 8
        : rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width
    };
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isSelected = 
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected
      });
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateString = date.toISOString().split('T')[0];
    onChange?.(dateString);
    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calendarDays = generateCalendarDays();
  const position = getCalendarPosition();

  return (
    <div className="relative">
      {/* Input Field */}
      <div
        ref={inputRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          "w-full h-12 px-4 py-3 text-sm",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "rounded-xl shadow-md hover:shadow-lg",
          "transition-all duration-200",
          "cursor-pointer",
          "flex items-center justify-between",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-primary-500 border-primary-500",
          className
        )}
      >
        <span className={clsx(
          "flex-1",
          selectedDate ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
        )}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <CalendarIcon className="w-5 h-5 text-primary-500 ml-2" />
      </div>

      {/* Calendar Popup */}
      {isOpen && createPortal(
        <div
          ref={calendarRef}
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-h-[90vh] overflow-y-auto"
          style={{
            top: position.top,
            left: position.left,
            minWidth: '320px',
            maxWidth: '400px'
          }}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day.date)}
                className={clsx(
                  "h-10 w-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  day.isCurrentMonth
                    ? "text-gray-900 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    : "text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                  day.isSelected && "bg-primary-500 text-white font-bold shadow-lg hover:bg-primary-600",
                  day.isToday && !day.isSelected && "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold border-2 border-primary-300 dark:border-primary-600",
                  !day.isCurrentMonth && "opacity-50"
                )}
              >
                {day.day}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setSelectedDate(new Date());
                onChange?.(new Date().toISOString().split('T')[0]);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                setSelectedDate(null);
                onChange?.('');
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Calendar;
