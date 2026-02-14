import React, { useState } from 'react';
import { MapPin, Clock, Search, ShoppingBag, Activity, AlertTriangle } from 'lucide-react';
import { supabase } from '../services/supabase';

export const RecentReportsCard = ({ reports = [] }: { reports: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatTime = (ds: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(ds).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const handleFlagReport = async (reportId: string) => {
    const reason = window.prompt("Why are you flagging this report? (e.g., Fake Price, Wrong Store)");
    if (!reason) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to flag reports.");
      return;
    }

    const { error } = await supabase.from('report_flags').insert([
      { report_id: reportId, reporter_id: user.id, reason }
    ]);

    if (error) {
      alert("Error submitting flag: " + error.message);
    } else {
      alert("Report flagged. Admin will review this shortly. Thank you!");
    }
  };

  const filteredReports = reports.filter((r) =>
    r.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-[#334155] rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-900/5 transition-all">
      <div className="p-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-[#1e293b]/50">
        <div className="flex items-center gap-2 font-black text-slate-700 dark:text-white uppercase tracking-wider text-sm">
          <Activity className="w-5 h-5 text-blue-500" /> 
          Recent Activity
        </div>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full uppercase">
          Live Feed
        </span>
      </div>

      <div className="p-4 bg-white dark:bg-[#334155]">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search items or stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-100 dark:border-white/5 rounded-2xl text-sm dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>
      </div>

      <div className="divide-y divide-slate-50 dark:divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
        {filteredReports.length > 0 ? (
          filteredReports.map((r: any) => (
            <div key={r.id} className="p-5 flex justify-between items-start hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 transition-colors group">
              <div className="flex gap-4">
                <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase leading-tight mb-1">
                    {r.item_name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                      {r.store_name} <span className="mx-1 opacity-30">•</span> {r.location}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end shrink-0 ml-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleFlagReport(r.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    title="Flag as fake"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                  <p className="font-black text-blue-600 dark:text-blue-400 text-lg leading-none">
                    RM {Number(r.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(r.created_at)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-3">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No matching reports</p>
            <p className="text-[10px] text-slate-300 mt-1">Try searching for something else</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-[#1e293b]/50 border-t border-slate-50 dark:border-white/5 text-center">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          Updating in real-time
        </p>
      </div>
    </div>
  );
};