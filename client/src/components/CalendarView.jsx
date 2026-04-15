import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ tasks = [], onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday)
  const startDayOfWeek = getDay(monthStart);

  // Create padding days
  const paddingDays = Array(startDayOfWeek).fill(null);

  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    return tasks.filter(task => isSameDay(new Date(task.datetime), day));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-card dark:glass-card glass-card-light p-4 sm:p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100 transition-all"
        >
          <ChevronLeft className="w-4 h-4 dark:text-dark-300 text-gray-600" />
        </button>
        <h3 className="font-semibold dark:text-dark-100 text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100 transition-all"
        >
          <ChevronRight className="w-4 h-4 dark:text-dark-300 text-gray-600" />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium dark:text-dark-400 text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Padding days */}
        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}

        {/* Actual days */}
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const hasOverdue = dayTasks.some(t => t.status === 'overdue');
          const hasPending = dayTasks.some(t => t.status === 'pending');
          const hasCompleted = dayTasks.some(t => t.status === 'completed');

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect?.(day)}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative
                transition-all duration-200 hover:scale-105
                ${isToday(day)
                  ? 'bg-primary-500/20 dark:text-primary-300 text-primary-600 font-bold ring-1 ring-primary-500/30'
                  : isSelected
                    ? 'bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/25'
                    : 'dark:text-dark-200 text-gray-700 hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100'
                }
              `}
            >
              <span>{format(day, 'd')}</span>
              {/* Task indicators */}
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 absolute bottom-1">
                  {hasOverdue && <span className="w-1 h-1 rounded-full bg-red-400" />}
                  {hasPending && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                  {hasCompleted && <span className="w-1 h-1 rounded-full bg-emerald-400" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
