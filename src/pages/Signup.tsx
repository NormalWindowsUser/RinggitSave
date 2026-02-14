import React, { useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { 
  UserPlus, ArrowLeft, Mail, Lock, 
  Loader2, ShieldCheck 
} from 'lucide-react';

export const Signup = () => {
  const navigate = useNavigate();
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the security check.");
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        captchaToken: captchaToken,
      }
    });
    
    if (error) {
      alert(error.message);
      setLoading(false);
      // Reset captcha on failure
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    } else {
      alert("Account created! You can now log in.");
      navigate('/login');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-[#1e293b] flex items-center justify-center p-4 overflow-y-auto transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#334155] p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
        
        <Link to="/" className="absolute top-8 right-8 text-slate-400 hover:text-emerald-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="relative z-10">
          <div className="mb-10">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Join the Movement</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Start contributing to community savings.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm" 
                    placeholder="name@example.com" 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Choose Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="password" 
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm" 
                    placeholder="Min. 6 characters" 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Turnstile Captcha - Same as ReportPrice/Login */}
            <div className="flex flex-col items-center py-2">
              <Turnstile
                ref={turnstileRef}
                siteKey="1x00000000000000000000AA"
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                options={{ theme: 'auto' }}
              />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading || !captchaToken} 
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating...</span></>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                  Anti-Bot Protection Active
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Already have an account? <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-black hover:underline">Log in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};