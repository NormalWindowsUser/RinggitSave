import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Key, User as UserIcon, Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatus(null);

    const { error } = await supabase.auth.updateUser({ 
      password: passwordData.new 
    });

    if (error) {
      setStatus({ type: 'error', msg: error.message });
    } else {
      setStatus({ type: 'success', msg: "Password updated successfully!" });
      setPasswordData({ current: '', new: '' });
      setTimeout(() => {
        setShowPasswordForm(false);
        setStatus(null);
      }, 2000);
    }
    setIsUpdating(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e293b]">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );

  if (!user) return <GuestView navigate={navigate} />;

  return (
    <div className="fixed inset-0 overflow-y-scroll no-scrollbar bg-gray-50 dark:bg-[#1e293b] transition-colors">
      {/* Global CSS Injection to force hide scrollbars on all browsers */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      <div className="p-6 pb-32">
        <div className="max-w-md mx-auto">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 mb-6 mt-4">Settings</h2>
          
          {/* PROFILE SECTION */}
          <div className="bg-white dark:bg-[#334155] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/5 mb-6">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl uppercase shadow-lg mb-4">
                {user.email?.[0]}
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 font-black mb-1">Verified Member</p>
              <p className="font-bold text-gray-900 dark:text-white break-all">{user.email}</p>
            </div>

            <div className="space-y-4">
              {/* PASSWORD TOGGLE */}
              {!showPasswordForm ? (
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1e293b] rounded-2xl text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-sm">Security & Password</span>
                  </div>
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="bg-gray-50 dark:bg-[#1e293b] p-5 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-black uppercase text-slate-400">Change Password</h4>
                    <button type="button" onClick={() => setShowPasswordForm(false)} className="text-[10px] font-bold text-red-400 uppercase">Cancel</button>
                  </div>
                  
                  <input 
                    type="password"
                    placeholder="New Password"
                    required
                    className="w-full p-3 bg-white dark:bg-[#334155] border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  />

                  {status && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {status.msg}
                    </div>
                  )}

                  <button 
                    disabled={isUpdating}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Save New Password'}
                  </button>
                </form>
              )}
              
              {/* LOGOUT */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/5 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Logout</span>
                </div>
              </button>
            </div>
          </div>

          {/* SECURITY CARD */}
          <div className="bg-slate-900 dark:bg-emerald-600 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-black text-sm uppercase tracking-wider">Security Tip</h3>
              </div>
              <p className="text-xs leading-relaxed opacity-90 font-medium">
                We recommend using a unique password. For account recovery, ensure your email address remains active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuestView = ({ navigate }: { navigate: any }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-[#1e293b] text-center">
    <div className="w-20 h-20 bg-white dark:bg-[#334155] rounded-3xl flex items-center justify-center shadow-sm mb-6">
      <UserIcon className="w-10 h-10 text-gray-300 dark:text-slate-500" />
    </div>
    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Community Account</h2>
    <div className="flex flex-col w-full max-w-xs gap-3 mt-8">
      <button onClick={() => navigate('/login')} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Login</button>
      <button onClick={() => navigate('/signup')} className="w-full py-4 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#334155] text-gray-900 dark:text-white rounded-2xl font-bold active:scale-95 transition-transform">Create Account</button>
    </div>
  </div>
);