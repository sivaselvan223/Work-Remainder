const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { getIO } = require('./socketService');
const { sendReminderEmail } = require('./emailService');

// Create next recurring task
const createNextRecurrence = async (task) => {
  const nextDate = new Date(task.datetime);

  switch (task.recurrence) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return;
  }

  await Task.create({
    userId: task.userId,
    title: task.title,
    description: task.description,
    datetime: nextDate,
    recurrence: task.recurrence,
    status: 'pending',
    notified: false
  });

  console.log(`🔄 Created recurring task: "${task.title}" for ${nextDate.toISOString()}`);
};

// Process due tasks
const processDueTasks = async () => {
  try {
    const now = new Date();

    // Find tasks that are due and haven't been notified
    const dueTasks = await Task.find({
      datetime: { $lte: now },
      status: 'pending',
      notified: false
    }).populate('userId', 'email name');

    // Note: populate won't work since userId refs User but we have the ID
    // We need to manually fetch user info
    for (const task of dueTasks) {
      const user = await User.findById(task.userId);
      if (!user) continue;

      const io = getIO();

      // Emit real-time notification
      if (io) {
        io.to(task.userId.toString()).emit('task:reminder', {
          _id: task._id,
          title: task.title,
          description: task.description,
          datetime: task.datetime
        });
      }

      // Send email notification
      await sendReminderEmail(user.email, task);

      // Mark as notified
      task.notified = true;
      await task.save();

      console.log(`⏰ Reminder triggered: "${task.title}" for ${user.email}`);

      // Handle recurring tasks
      if (task.recurrence !== 'none') {
        await createNextRecurrence(task);
      }
    }

    // Mark overdue tasks
    await Task.updateMany(
      {
        datetime: { $lt: now },
        status: 'pending',
        notified: true
      },
      { status: 'overdue' }
    );
  } catch (error) {
    console.error('Scheduler error:', error);
  }
};

// Check for missed reminders on startup
const checkMissedReminders = async () => {
  console.log('🔍 Checking for missed reminders...');
  await processDueTasks();
};

// Start the cron scheduler
const startScheduler = () => {
  // Run every 30 seconds
  cron.schedule('*/30 * * * * *', processDueTasks);
  console.log('⏰ Scheduler started (checking every 30 seconds)');

  // Check missed reminders on startup
  checkMissedReminders();
};

module.exports = { startScheduler };
