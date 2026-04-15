const Task = require('../models/Task');

// @desc    Get all tasks for user
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { status, date, filter } = req.query;
    const query = { userId: req.user._id };

    // Status filter
    if (status && ['pending', 'completed', 'overdue'].includes(status)) {
      query.status = status;
    }

    // Date filter
    if (filter) {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      if (filter === 'today') {
        query.datetime = { $gte: startOfDay, $lt: endOfDay };
      } else if (filter === 'tomorrow') {
        const startOfTomorrow = new Date(startOfDay);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        const endOfTomorrow = new Date(startOfTomorrow);
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        query.datetime = { $gte: startOfTomorrow, $lt: endOfTomorrow };
      } else if (filter === 'week') {
        const endOfWeek = new Date(startOfDay);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        query.datetime = { $gte: startOfDay, $lt: endOfWeek };
      }
    }

    // Specific date
    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.datetime = { $gte: targetDate, $lt: nextDate };
    }

    const tasks = await Task.find(query).sort({ datetime: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Create task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, datetime, recurrence } = req.body;

    if (!title || !datetime) {
      return res.status(400).json({ message: 'Title and date/time are required' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description: description || '',
      datetime: new Date(datetime),
      recurrence: recurrence || 'none'
    });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task:created', task);
    }

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, datetime, recurrence, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (datetime !== undefined) {
      task.datetime = new Date(datetime);
      task.notified = false; // Reset notification for rescheduled task
    }
    if (recurrence !== undefined) task.recurrence = recurrence;
    if (status !== undefined) task.status = status;

    await task.save();

    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task:updated', task);
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/complete
exports.toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task:updated', task);
    }

    res.json(task);
  } catch (error) {
    console.error('Toggle complete error:', error);
    res.status(500).json({ message: 'Server error toggling task' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task:deleted', { _id: req.params.id });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, pending, completed, overdue] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'pending' }),
      Task.countDocuments({ userId, status: 'completed' }),
      Task.countDocuments({ userId, status: 'overdue' })
    ]);

    res.json({ total, pending, completed, overdue });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
