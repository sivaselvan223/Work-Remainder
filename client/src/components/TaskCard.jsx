import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { Check, Edit3, Trash2, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onToggleComplete, onDelete }) => {
  const isOverdue = task.status === 'overdue' || (task.status === 'pending' && isPast(new Date(task.datetime)));
  const isCompleted = task.status === 'completed';
  const taskDate = new Date(task.datetime);

  const getDateLabel = () => {
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    return format(taskDate, 'MMM dd, yyyy');
  };

  const getRecurrenceLabel = () => {
    if (!task.recurrence || task.recurrence === 'none') return null;
    return task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1);
  };

  const statusColors = {
    pending: 'bg-amber-400',
    completed: 'bg-emerald-400',
    overdue: 'bg-red-400'
  };

  return (
    <div
      className={`
        glass-card dark:glass-card glass-card-light p-4 sm:p-5
        transition-all duration-300 hover:border-primary-500/20 dark:hover:border-primary-500/20 hover:border-primary-300/30
        hover:shadow-xl hover:-translate-y-0.5 group
        ${isOverdue ? 'overdue-glow border-red-500/20 dark:border-red-500/20' : ''}
        ${isCompleted ? 'opacity-60' : ''}
        animate-fade-in
      `}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Status Indicator + Complete Button */}
        <button
          onClick={() => onToggleComplete(task._id)}
          className={`
            mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0
            transition-all duration-300 hover:scale-110
            ${isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : isOverdue
                ? 'border-red-400/50 hover:border-red-400 hover:bg-red-500/10'
                : 'border-dark-500 dark:border-dark-500 border-gray-300 hover:border-primary-400 hover:bg-primary-500/10'
            }
          `}
        >
          {isCompleted && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`
              font-semibold text-base
              ${isCompleted ? 'line-through dark:text-dark-400 text-gray-400' : 'dark:text-dark-100 text-gray-800'}
            `}>
              {task.title}
            </h3>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${statusColors[isOverdue ? 'overdue' : task.status]}`} />
          </div>

          {task.description && (
            <p className={`text-sm mt-1 line-clamp-2 ${isCompleted ? 'dark:text-dark-500 text-gray-400' : 'dark:text-dark-400 text-gray-500'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-2 mt-3">
            {/* Date & Time */}
            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg
              ${isOverdue
                ? 'bg-red-500/10 text-red-400'
                : isCompleted
                  ? 'dark:bg-white/[0.03] bg-gray-100 dark:text-dark-500 text-gray-400'
                  : 'dark:bg-white/[0.05] bg-gray-100 dark:text-dark-300 text-gray-600'
              }`}
            >
              {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>{getDateLabel()}</span>
              <span>•</span>
              <span>{format(taskDate, 'hh:mm a')}</span>
            </div>

            {/* Relative time */}
            {!isCompleted && (
              <span className={`text-xs ${isOverdue ? 'text-red-400' : 'dark:text-dark-500 text-gray-400'}`}>
                {isPast(taskDate) ? `${formatDistanceToNow(taskDate)} ago` : `in ${formatDistanceToNow(taskDate)}`}
              </span>
            )}

            {/* Recurrence badge */}
            {getRecurrenceLabel() && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-primary-500/10 text-primary-400">
                <RotateCcw className="w-3 h-3" />
                {getRecurrenceLabel()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t dark:border-white/[0.05] border-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     dark:text-dark-300 text-gray-600 hover:bg-primary-500/10 hover:text-primary-400 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     dark:text-dark-300 text-gray-600 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
