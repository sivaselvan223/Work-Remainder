import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../utils/notifications';

export const useSocket = (onTaskEvent) => {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    if (!token || !isAuthenticated) return;

    if (socketRef.current?.connected) return;

    socketRef.current = io('http://localhost:5000', {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    socketRef.current.on('task:reminder', (task) => {
      console.log('⏰ Reminder received:', task.title);
      
      // Show browser notification
      showNotification(`⏰ Reminder: ${task.title}`, {
        body: task.description || 'Your task is due now!',
        tag: task._id
      });

      // Update task in UI
      if (onTaskEvent) {
        onTaskEvent('task:updated', { ...task, notified: true });
      }
    });

    socketRef.current.on('task:created', (task) => {
      if (onTaskEvent) onTaskEvent('task:created', task);
    });

    socketRef.current.on('task:updated', (task) => {
      if (onTaskEvent) onTaskEvent('task:updated', task);
    });

    socketRef.current.on('task:deleted', (data) => {
      if (onTaskEvent) onTaskEvent('task:deleted', data);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }, [token, isAuthenticated, onTaskEvent]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return socketRef;
};
