// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Show browser notification
export const showNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    icon: '/reminder-icon.png',
    badge: '/reminder-icon.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    ...options
  });

  // Play notification sound
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHjl+pMfUo1cwIUF3nMDJqmM/LlZ0l7vErmxING1ykLe7rG1PR3Fwjq+xpmNDSHl2krC6q25QSXh2kLO7rGxJP3V0jq+xpmNHSnl2krK7q3BPR3Fwjq+xpmNDSHl2krC6q3BUSnV0i6qvpGJHSXZzkrO7rG5PR3Bwjq+xpmNFSnl2krK7q3BRRXF0i6uxpmNHSXZ2krO7rWxHQHByjq+wpmRHR3d0krK7q25LQnF0jq+xpmNHSnl2krC6q3BRRXF0i6uxpmNFSnl2krK');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (e) {}

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto-close after 10 seconds
  setTimeout(() => notification.close(), 10000);

  return notification;
};

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};
