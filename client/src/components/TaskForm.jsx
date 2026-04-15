import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Type, AlignLeft, Repeat } from 'lucide-react';
import { format } from 'date-fns';

const TaskForm = ({ isOpen, onClose, onSubmit, editTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    recurrence: 'none'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editTask) {
      const dt = new Date(editTask.datetime);
      setFormData({
        title: editTask.title,
        description: editTask.description || '',
        date: format(dt, 'yyyy-MM-dd'),
        time: format(dt, 'HH:mm'),
        recurrence: editTask.recurrence || 'none'
      });
    } else {
      // Default to today + 1 hour from now
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      setFormData({
        title: '',
        description: '',
        date: format(now, 'yyyy-MM-dd'),
        time: format(now, 'HH:mm'),
        recurrence: 'none'
      });
    }
    setErrors({});
  }, [editTask, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const datetime = new Date(`${formData.date}T${formData.time}`);
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        datetime: datetime.toISOString(),
        recurrence: formData.recurrence
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to save task' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg glass-card dark:glass-card glass-card-light p-0 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-white/[0.08] border-gray-200/50">
          <h2 className="text-lg font-bold dark:text-dark-100 text-gray-800">
            {editTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5 dark:text-dark-400 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium dark:text-dark-200 text-gray-700 mb-1.5">
              <Type className="w-4 h-4 text-primary-400" />
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field dark:input-field input-field-light"
              placeholder="e.g., Team standup meeting"
              autoFocus
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium dark:text-dark-200 text-gray-700 mb-1.5">
              <AlignLeft className="w-4 h-4 text-primary-400" />
              Description
              <span className="text-dark-500 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field dark:input-field input-field-light resize-none h-24"
              placeholder="Add details about your task..."
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium dark:text-dark-200 text-gray-700 mb-1.5">
                <Calendar className="w-4 h-4 text-primary-400" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field dark:input-field input-field-light"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium dark:text-dark-200 text-gray-700 mb-1.5">
                <Clock className="w-4 h-4 text-primary-400" />
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input-field dark:input-field input-field-light"
              />
              {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium dark:text-dark-200 text-gray-700 mb-1.5">
              <Repeat className="w-4 h-4 text-primary-400" />
              Repeat
            </label>
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
              className="input-field dark:input-field input-field-light"
            >
              <option value="none">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 dark:btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
