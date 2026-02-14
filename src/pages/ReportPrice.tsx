import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { 
  MapPin, ChevronLeft, Loader2, Search, 
  Sparkles, ShieldCheck, AlertCircle 
} from 'lucide-react';

export const ReportPrice = () => {
  const navigate = useNavigate();
  const turnstileRef = useRef<TurnstileInstance>(null);
  
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const [items, setItems] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    item_name: '',
    price: '',
    location: ''
  });

  useEffect(() => {
    const checkBanAndLoadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.is_banned) {
        alert("Your account is restricted from making reports.");
        navigate('/');
        return;
      }

      try {
        // UPDATED: Now fetching state_id along with the location name
        const [itemRes, locRes] = await Promise.all([
          supabase.from('official_items').select('name'),
          supabase.from('official_locations').select('name, state_id')
        ]);
        if (itemRes.data) setItems(itemRes.data);
        if (locRes.data) setLocations(locRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
      setCheckingAuth(false);
    };
    checkBanAndLoadData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the security check.");
      return;
    }

    const validItem = items.find(i => i.name === formData.item_name);
    const validLoc = locations.find(l => l.name === formData.location);

    if (!validItem || !validLoc) {
      alert("Please select a valid item and location from the suggestions.");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const brand = formData.location.split(' ')[0];

    // UPDATED: Now including state_id in the insertion
    const { error } = await supabase.from('price_reports').insert([{
      item_name: formData.item_name,
      price: parseFloat(formData.price),
      location: formData.location,
      store_name: brand,
      state_id: validLoc.state_id, // Links the report to the correct state
      user_id: user?.id
    }]);

    if (!error) {
      navigate('/');
    } else {
      alert(error.message);
      setLoading(false);
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1e293b]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-[#1e293b] overflow-y-auto transition-colors duration-300">
      <div className="max-w-md mx-auto p-6 pb-32">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-all group"
        >
          <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase">Back</span>
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">New Contribution</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Your contribution helps others save money.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">What did you find?</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text" list="item-list" placeholder="Search items..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#334155] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium shadow-sm"
                value={formData.item_name}
                onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                required
              />
              <datalist id="item-list">
                {items.map((item, index) => <option key={index} value={item.name} />)}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Price</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-emerald-500 transition-colors">RM</div>
              <input
                type="number" step="0.01" required placeholder="0.00"
                className="w-full pl-14 pr-4 py-4 bg-white dark:bg-[#334155] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-xl shadow-sm"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Store Location</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text" list="location-list" placeholder="Search stores..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#334155] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium shadow-sm"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
              <datalist id="location-list">
                {locations.map((loc, index) => <option key={index} value={loc.name} />)}
              </datalist>
            </div>
          </div>

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
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></>
              ) : (
                'Publish Contribution'
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                Anti-Bot Protection Active
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};