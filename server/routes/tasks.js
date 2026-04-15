const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  toggleComplete,
  deleteTask,
  getStats
} = require('../controllers/taskController');
const protect = require('../middlewares/auth');

// All task routes are protected
router.use(protect);

router.get('/stats', getStats);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);
router.patch('/:id/complete', toggleComplete);

module.exports = router;
