import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { PriceCheckCard } from './PriceCheckCard';
import { TopSavingsCard } from './TopSavingsCard';
import { RecentReportsCard } from './RecentReportsCard';
import { useGroceryData } from '../hooks/useGroceryData';
import { 
  Loader2, Building2, Plus, 
  MapPin, Gift, ChevronDown, ChevronRight, Store 
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [states, setStates] = useState<any[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  
  const [visibleCount, setVisibleCount] = useState(5);
  const { groceryItems, priceReports, topSavings, activeUsers, loading } = useGroceryData();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const fetchStates = async () => {
      const { data } = await supabase.from('states').select('*').order('name');
      if (data) setStates(data);
    };
    fetchStates();
  }, []);

  // --- DERIVED DATA & FILTER LOGIC ---

  const availableStores = useMemo(() => {
    const reportsInRegion = selectedStateId 
      ? priceReports.filter((r: any) => r.state_id === selectedStateId)
      : priceReports;
    
    const stores = reportsInRegion.map((r: any) => r.location);
    return [...new Set(stores)].sort();
  }, [selectedStateId, priceReports]);

  const filteredReports = useMemo(() => {
    return priceReports.filter((report: any) => {
      const matchesState = !selectedStateId || report.state_id === selectedStateId;
      const matchesStore = !selectedStore || report.location === selectedStore;
      return matchesState && matchesStore;
    });
  }, [selectedStateId, selectedStore, priceReports]);

  const paginatedReports = filteredReports.slice(0, visibleCount);
  const hasMore = filteredReports.length > visibleCount;
  const uniqueLocationsCount = [...new Set(filteredReports.map((r: any) => r.location))].length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e293b]">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e293b] pb-24 transition-colors overflow-y-auto no-scrollbar">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* --- HEADER --- */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/5 pt-8 pb-6 px-6">
        <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user ? `Hello, ${user.email?.split('@')[0]}` : 'Ringgit-Save'}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {/* REGION SELECTOR */}
              <div className="flex items-center gap-2 group relative w-fit">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <div className="relative flex items-center">
                  <select 
                    value={selectedStateId || ''} 
                    onChange={(e) => {
                      setSelectedStateId(e.target.value || null);
                      setSelectedStore(null);
                      setVisibleCount(5); 
                    }}
                    className="bg-transparent text-xs font-bold text-gray-500 dark:text-gray-400 outline-none appearance-none pr-5 cursor-pointer hover:text-emerald-600 transition-colors z-10"
                  >
                    <option value="">Satu Malaysia</option>
                    {states.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none group-hover:text-emerald-600 transition-colors" />
                </div>
              </div>

              {/* STALL SELECTOR */}
              <div className="flex items-center gap-2 group relative w-fit">
                <Store className="w-3.5 h-3.5 text-blue-500" />
                <div className="relative flex items-center">
                  <select 
                    value={selectedStore || ''} 
                    onChange={(e) => {
                      setSelectedStore(e.target.value || null);
                      setVisibleCount(5); 
                    }}
                    className="bg-transparent text-xs font-bold text-gray-500 dark:text-gray-400 outline-none appearance-none pr-5 cursor-pointer hover:text-blue-600 transition-colors z-10"
                  >
                    <option value="">All Stalls</option>
                    {availableStores.map(store => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {!user && (
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-all active:scale-95 w-fit"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 mt-6 space-y-6">
        
        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <SimpleStat label="Reports" value={filteredReports.length} />
          <SimpleStat label="Users" value={activeUsers} />
          <SimpleStat label="Stores" value={uniqueLocationsCount} />
        </div>

        {/* PRIMARY ACTION */}
        <button 
          onClick={() => navigate(user ? '/report' : '/login')} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>Submit Contribution</span>
        </button>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price Check</h3>
            <PriceCheckCard items={groceryItems} reports={filteredReports} />
          </div>
          <div className="space-y-3">
            <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Best Deals</h3>
            <TopSavingsCard savings={topSavings} />
          </div>
        </div>

        {/* ACTIVITY LIST */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recent Activity</h3>
            <span className="text-[10px] font-bold text-emerald-500">Showing {paginatedReports.length} of {filteredReports.length}</span>
          </div>
          
          <div className="bg-white dark:bg-[#334155] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm">
            <RecentReportsCard reports={paginatedReports} showDate={true} />
            
            {hasMore && (
              <button 
                onClick={() => setVisibleCount(prev => prev + 1000)}
                className="w-full py-4 bg-gray-50 dark:bg-white/5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-1 hover:bg-gray-100 transition-colors"
              >
                View More Contributions <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* --- ADDITIONAL TOOLS & RESOURCES --- */}
        <div className="space-y-3 pb-12">
          <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Useful Websites
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SARA CHECKER */}
            <a 
              href="https://checkstatus.mykasih.net/sara2/checkstatus" 
              target="_blank" 
              rel="noreferrer" 
              className="group relative bg-white dark:bg-[#334155] p-5 rounded-3xl border border-gray-200 dark:border-white/5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all active:scale-[0.98]"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-grow">
                <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Semakan STR / SARA</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Semak Kelayakan SARA</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Semak status bantuan MyKasih secara terus.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </a>

            {/* MS REWARDS */}
            <a 
              href="https://rewards.bing.com/welcome" 
              target="_blank" 
              rel="noreferrer" 
              className="group relative bg-white dark:bg-[#334155] p-5 rounded-3xl border border-gray-200 dark:border-white/5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all active:scale-[0.98]"
            >
              <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-grow">
                <p className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-tighter">Free Vouchers</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Microsoft Rewards</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Tebus baucar Lotus's / Grab.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleStat = ({ label, value }: { label: string, value: number }) => (
  <div className="bg-white dark:bg-[#334155] p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm transition-all">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 opacity-70">{label}</p>
    <p className="text-xl font-bold dark:text-white">{value}</p>
  </div>
);