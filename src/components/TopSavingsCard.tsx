import React from 'react';
import { Sparkles, TrendingDown } from 'lucide-react';

interface SavingItem {
  item: string;
  saving: number;
  percentage: number;
}

export const TopSavingsCard = ({ savings = [] }: { savings: SavingItem[] }) => {
  return (
    <div className="bg-white dark:bg-[#334155] p-6 rounded-[2rem] shadow-xl shadow-slate-900/5 border border-slate-100 dark:border-white/5 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white tracking-tight">Top Savings Today</h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
      </div>

      <div className="space-y-3">
        {savings.length > 0 ? (
          savings.map((s, i) => (
            <div 
              key={i} 
              className="group relative flex justify-between items-start p-4 bg-slate-50 dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-emerald-500/20 hover:bg-white dark:hover:bg-[#1e293b] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 hidden sm:flex w-10 h-10 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl items-center justify-center text-emerald-600 shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  {/* REMOVED truncate - Now shows full name like "Telur Gred A (30s)" */}
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase leading-tight mb-1">
                    {s.item}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-black">
                      Save RM{Number(s.saving || 0).toFixed(2)}
                    </p>
                    {i === 0 && (
                      <span className="text-[8px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-black uppercase animate-pulse shrink-0">
                        Best Deal
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-4 shrink-0">
                <span className="inline-block px-3 py-1.5 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  -{s.percentage}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Scanning Markets...</p>
            <p className="text-[10px] text-slate-300 mt-1">Check back in a moment</p>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
        Based on community reports
      </p>
    </div>
  );
};