import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTasks = useCallback(async (activeFilter) => {
    try {
      setLoading(true);
      const params = {};
      const f = activeFilter || filter;
      if (f && f !== 'all') {
        params.filter = f;
      }
      const res = await api.get('/tasks', { params });
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  const createTask = async (taskData) => {
    const res = await api.post('/tasks', taskData);
    setTasks(prev => [...prev, res.data].sort((a, b) => new Date(a.datetime) - new Date(b.datetime)));
    fetchStats();
    return res.data;
  };

  const updateTask = async (id, taskData) => {
    const res = await api.put(`/tasks/${id}`, taskData);
    setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    fetchStats();
    return res.data;
  };

  const toggleComplete = async (id) => {
    const res = await api.patch(`/tasks/${id}/complete`);
    setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    fetchStats();
    return res.data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
    fetchStats();
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    fetchTasks(newFilter);
  };

  // Handle real-time updates from socket
  const handleSocketUpdate = useCallback((event, data) => {
    switch (event) {
      case 'task:created':
        setTasks(prev => {
          if (prev.find(t => t._id === data._id)) return prev;
          return [...prev, data].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        });
        fetchStats();
        break;
      case 'task:updated':
        setTasks(prev => prev.map(t => t._id === data._id ? data : t));
        fetchStats();
        break;
      case 'task:deleted':
        setTasks(prev => prev.filter(t => t._id !== data._id));
        fetchStats();
        break;
      default:
        break;
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  return {
    tasks,
    stats,
    loading,
    filter,
    changeFilter,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    fetchTasks,
    fetchStats,
    handleSocketUpdate
  };
};
