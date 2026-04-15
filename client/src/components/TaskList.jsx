import TaskCard from './TaskCard';
import { ClipboardList } from 'lucide-react';

const TaskList = ({ tasks, loading, onEdit, onToggleComplete, onDelete }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card dark:glass-card glass-card-light p-5 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-lg dark:bg-dark-700 bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-5 dark:bg-dark-700 bg-gray-200 rounded-lg w-3/4" />
                <div className="h-4 dark:bg-dark-700 bg-gray-200 rounded-lg w-1/2" />
                <div className="h-3 dark:bg-dark-700 bg-gray-200 rounded-lg w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card dark:glass-card glass-card-light p-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold dark:text-dark-200 text-gray-700 mb-2">No tasks found</h3>
        <p className="dark:text-dark-400 text-gray-500 text-sm">
          Create your first task to get started with reminders!
        </p>
      </div>
    );
  }

  // Group tasks by status
  const pending = tasks.filter(t => t.status === 'pending');
  const overdue = tasks.filter(t => t.status === 'overdue');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Overdue Tasks */}
      {overdue.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Overdue ({overdue.length})
          </h3>
          <div className="space-y-3">
            {overdue.map(task => (
              <TaskCard key={task._id} task={task} onEdit={onEdit} onToggleComplete={onToggleComplete} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Pending Tasks */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold dark:text-dark-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Upcoming ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map(task => (
              <TaskCard key={task._id} task={task} onEdit={onEdit} onToggleComplete={onToggleComplete} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold dark:text-dark-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Completed ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.map(task => (
              <TaskCard key={task._id} task={task} onEdit={onEdit} onToggleComplete={onToggleComplete} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
