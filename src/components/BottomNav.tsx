import React, { useEffect, useState } from 'react';
import { Home, PlusCircle, User, ShieldCheck, History } from 'lucide-react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface BottomNavProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_banned')
          .eq('id', user.id)
          .maybeSingle();

        setIsAdmin(profile?.role === 'Admin');
        setIsBanned(profile?.is_banned === true);
      } else {
        setIsAdmin(false);
        setIsBanned(false);
      }
    };
    checkUserStatus();
  }, [location]);

  const navItems = [
    { id: 'home' as NavItem, label: 'Home', icon: Home, path: '/' },
    { id: 'activity' as NavItem, label: 'Activity', icon: History, path: '/my-activity' },
  ];

  if (!isBanned) {
    navItems.push({ id: 'report' as NavItem, label: 'Contribute', icon: PlusCircle, path: '/report' });
  }

  navItems.push({ id: 'account' as NavItem, label: 'Account', icon: User, path: '/account' });

  if (isAdmin) {
    navItems.push({ id: 'admin' as NavItem, label: 'Admin', icon: ShieldCheck, path: '/admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#334155]/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50 transition-colors duration-500">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isReport = item.id === 'report';

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-col items-center justify-center transition-all duration-300 rounded-2xl ${
                  isReport 
                    ? 'flex-[1.5] mx-2' // Make report slightly wider but not taller
                    : 'flex-1'
                }`}
              >
                <div className={`flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all ${
                  isReport
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95'
                    : isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}>
                  <Icon className={`${isReport ? 'w-6 h-6 mb-0.5' : 'w-5 h-5'}`} strokeWidth={isReport ? 3 : 2} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isReport ? 'text-white' : 'opacity-80'
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                {/* Active Indicator Line for non-report items */}
                {isActive && !isReport && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};