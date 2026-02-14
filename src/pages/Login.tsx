import React, { useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { 
  Lock, Mail, Loader2, ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the security check.");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          captchaToken: captchaToken,
        }
      });
      
      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      alert(error.message);
      // Reset captcha on failure
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#1e293b] flex items-center justify-center p-4 transition-colors duration-300">
      {/* Login Card Container */}
      <div className="w-full max-w-md bg-white dark:bg-[#334155] p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
        
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Continue tracking and saving today.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="email" 
                    required 
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm" 
                    placeholder="name@example.com" 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="password" 
                    required 
                    autoComplete="current-password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm" 
                    placeholder="Enter your password" 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Turnstile Captcha Section */}
            <div className="flex flex-col items-center py-2">
              <Turnstile
                ref={turnstileRef}
                siteKey="1x00000000000000000000AA" // Replace with your actual Cloudflare Site Key
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                options={{ 
                  theme: 'auto',
                  size: 'normal'
                }}
              />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading || !captchaToken} 
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                  Anti-Bot Protection Active
                </p>
              </div>
            </div>

            <div className="pt-4 text-center border-t border-slate-100 dark:border-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                New here? <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-black hover:underline ml-1">Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};