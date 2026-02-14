// Replace your return statement with this:

return (
  <div className="min-h-screen bg-gray-50 dark:bg-[#1e293b] flex items-center justify-center p-4 transition-colors duration-300">
    {/* Inner Container: Added max-h and overflow handling just in case of small screens */}
    <div className="w-full max-w-md bg-white dark:bg-[#334155] p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
      
      {/* Subtle Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

      <div className="relative z-10">
        <div className="mb-8"> {/* Reduced margin slightly for better fit */}
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Continue tracking and saving today.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm" 
                  placeholder="Enter your password" 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Turnstile Captcha */}
          <div className="flex flex-col items-center py-1">
            <Turnstile
              ref={turnstileRef}
              siteKey="1x00000000000000000000AA"
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              options={{ theme: 'auto', size: 'normal' }}
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading || !captchaToken} 
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing In...</span></>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                Anti-Bot Protection Active
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              New here? <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-black hover:underline">Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
);