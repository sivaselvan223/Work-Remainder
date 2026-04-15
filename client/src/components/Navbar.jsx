import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, LogOut, Menu, X, Clock } from 'lucide-react';

const Navbar = ({ notifications = [], onClearNotifications }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.length;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/[0.03] dark:bg-white/[0.03] bg-white/70 border-b border-white/[0.08] dark:border-white/[0.08] border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">WorkReminder</h1>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100 transition-all duration-300"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-dark-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100 transition-all duration-300 relative"
              >
                <Bell className="w-5 h-5 dark:text-dark-300 text-dark-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-bounce-soft">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-card dark:glass-card glass-card-light p-0 overflow-hidden animate-slide-down">
                  <div className="p-3 border-b border-white/[0.08] dark:border-white/[0.08] border-gray-200/50 flex items-center justify-between">
                    <h3 className="font-semibold dark:text-dark-100 text-gray-800 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => { onClearNotifications?.(); setShowNotifications(false); }}
                        className="text-xs text-primary-400 hover:text-primary-300"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center dark:text-dark-400 text-gray-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="p-3 border-b border-white/[0.05] dark:border-white/[0.05] border-gray-100 hover:bg-white/[0.03] dark:hover:bg-white/[0.03] hover:bg-gray-50 transition-colors">
                          <p className="text-sm font-medium dark:text-dark-100 text-gray-800">⏰ {n.title}</p>
                          <p className="text-xs dark:text-dark-400 text-gray-500 mt-1">{n.description || 'Task is due now!'}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-white/[0.08] dark:border-white/[0.08] border-gray-200/50">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium dark:text-dark-200 text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="p-2 rounded-xl hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-xl hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 dark:text-dark-200 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 dark:text-dark-200 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-white/[0.08] dark:border-white/[0.08] border-gray-200/50 animate-slide-down">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium dark:text-dark-100 text-gray-800">{user?.name}</p>
                <p className="text-xs dark:text-dark-400 text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={toggleTheme} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] dark:hover:bg-white/[0.05] hover:bg-gray-100 transition-all w-full text-left">
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-dark-600" />}
                <span className="text-sm dark:text-dark-200 text-gray-700">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button onClick={logout} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/10 transition-all w-full text-left">
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
