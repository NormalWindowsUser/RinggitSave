import React, { useState, useEffect } from 'react';
import { Bell, User, X, Sun, Moon, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // 1. Theme State Initialization
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 2. Sync Theme with DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // 3. Logout Logic
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    navigate('/login');
  };

  // 4. Auth Subscription
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const notifications = [
    { id: 1, text: "Welcome to Ringgit-Save!", time: "Just now", read: false },
    { id: 2, text: "Tip: Verify prices before posting.", time: "1 day ago", read: true }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-screen-lg mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg">R</div>
          <span className="font-bold text-gray-900 dark:text-white tracking-tight text-lg">Ringgit-Save</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 text-gray-400 hover:text-emerald-600 rounded-full transition-all">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-400 hover:text-emerald-600 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-20 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center px-3 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
                    <span className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notifications</span>
                    <button onClick={() => setShowNotifications(false)}><X className="w-3 h-3 text-gray-400" /></button>
                  </div>
                  <div className="space-y-1">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3 rounded-xl text-sm ${n.read ? 'bg-white dark:bg-gray-800' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Section (Profile + Logout Dropdown) */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 p-[2px] shadow-md active:scale-95 transition-transform"
              >
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-20 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Logged in as</p>
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => { navigate('/account'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" /> Account
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};