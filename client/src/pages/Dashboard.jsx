import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useSocket } from '../hooks/useSocket';
import { requestNotificationPermission, showNotification } from '../utils/notifications';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import CalendarView from '../components/CalendarView';
import { Plus, ListTodo, CheckCircle2, AlertTriangle, Clock, CalendarDays, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { format, isSameDay } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    tasks, stats, loading, filter, changeFilter,
    createTask, updateTask, toggleComplete, deleteTask,
    handleSocketUpdate, fetchTasks, fetchStats
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [allTasks, setAllTasks] = useState([]);

  // Fetch all tasks for calendar (unfiltered)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/tasks');
        setAllTasks(res.data);
      } catch (e) {}
    };
    fetchAll();
  }, [tasks]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Socket event handler
  const onSocketEvent = useCallback((event, data) => {
    handleSocketUpdate(event, data);

    if (event === 'task:reminder') {
      setNotifications(prev => [data, ...prev]);
      showNotification(`⏰ ${data.title}`, {
        body: data.description || 'Your task is due now!',
        tag: data._id
      });
      toast('⏰ Reminder: ' + data.title, {
        icon: '🔔',
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid rgba(99,102,241,0.3)',
        },
        duration: 8000,
      });
      // Refresh to update statuses
      fetchTasks();
      fetchStats();
    }
  }, [handleSocketUpdate, fetchTasks, fetchStats]);

  // Connect socket
  useSocket(onSocketEvent);

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
    toast.success('Task created!');
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    await updateTask(editingTask._id, taskData);
    toast.success('Task updated!');
    setEditingTask(null);
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find(t => t._id === id);
    await toggleComplete(id);
    toast.success(task?.status === 'completed' ? 'Task reopened' : 'Task completed! 🎉');
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    toast.success('Task deleted');
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDateSelect = (date) => {
    if (selectedDate && isSameDay(selectedDate, date)) {
      setSelectedDate(null);
      changeFilter('all');
    } else {
      setSelectedDate(date);
      // Fetch tasks for selected date
      const dateStr = format(date, 'yyyy-MM-dd');
      changeFilter('all');
      // We'll filter client-side for calendar date selection
    }
  };

  const clearNotifications = () => setNotifications([]);

  const filters = [
    { key: 'all', label: 'All Tasks', icon: LayoutGrid },
    { key: 'today', label: 'Today', icon: Clock },
    { key: 'tomorrow', label: 'Tomorrow', icon: CalendarDays },
    { key: 'week', label: 'This Week', icon: ListTodo },
  ];

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'from-primary-500 to-primary-600', textColor: 'text-primary-400' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500', textColor: 'text-amber-400' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'from-emerald-500 to-green-500', textColor: 'text-emerald-400' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'from-red-500 to-rose-500', textColor: 'text-red-400' },
  ];

  // Filter tasks for selected calendar date
  const displayTasks = selectedDate
    ? tasks.filter(t => isSameDay(new Date(t.datetime), selectedDate))
    : tasks;

  return (
    <div className="min-h-screen dark:gradient-bg gradient-bg-light">
      <Navbar notifications={notifications} onClearNotifications={clearNotifications} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-dark-100 text-gray-800">
            Welcome back, <span className="gradient-text">{user?.name}</span> 👋
          </h1>
          <p className="dark:text-dark-400 text-gray-500 mt-1">
            Here's your task overview for today
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card dark:stat-card animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-xs sm:text-sm dark:text-dark-400 text-gray-500 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters + Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {filters.map(f => (
                  <button
                    key={f.key}
                    onClick={() => { setSelectedDate(null); changeFilter(f.key); }}
                    className={`filter-tab flex items-center gap-1.5 ${
                      filter === f.key && !selectedDate ? 'filter-tab-active' : 'filter-tab-inactive'
                    }`}
                  >
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                id="add-task-btn"
                onClick={() => { setEditingTask(null); setShowForm(true); }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            {/* Selected date label */}
            {selectedDate && (
              <div className="flex items-center gap-2">
                <span className="text-sm dark:text-dark-300 text-gray-600">
                  Showing tasks for <span className="font-semibold text-primary-400">{format(selectedDate, 'MMMM d, yyyy')}</span>
                </span>
                <button
                  onClick={() => { setSelectedDate(null); changeFilter('all'); }}
                  className="text-xs text-primary-400 hover:text-primary-300 underline"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Task List */}
            <TaskList
              tasks={displayTasks}
              loading={loading}
              onEdit={handleEdit}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          </div>

          {/* Calendar Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-dark-100 text-gray-800">Calendar</h2>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="text-xs text-primary-400 hover:text-primary-300 lg:hidden"
              >
                {showCalendar ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className={`${showCalendar ? '' : 'hidden lg:block'}`}>
              <CalendarView
                tasks={allTasks}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>

            {/* Quick stats sidebar */}
            <div className="glass-card dark:glass-card glass-card-light p-4 animate-fade-in">
              <h3 className="font-semibold dark:text-dark-200 text-gray-700 text-sm mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs dark:text-dark-400 text-gray-500">Completion Rate</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full dark:bg-dark-700 bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={() => { setEditingTask(null); setShowForm(true); }}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600
                   text-white shadow-xl shadow-primary-500/30 flex items-center justify-center
                   hover:scale-105 active:scale-95 transition-transform z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        editTask={editingTask}
      />
    </div>
  );
};

export default Dashboard;
