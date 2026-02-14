import React, { useState, useMemo } from 'react';
import { Search, TrendingDown, Store, AlertCircle, Trophy, Navigation } from 'lucide-react';

interface PriceCheckProps {
  items: any[];
  reports: any[];
}

export const PriceCheckCard = ({ items, reports }: PriceCheckProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Find the top 3 best prices for the selected item
  const topDeals = useMemo(() => {
    if (!searchTerm) return [];

    // Filter and then sort by price (lowest first)
    return reports
      .filter((r) => r.item_name.toLowerCase() === searchTerm.toLowerCase())
      .sort((a, b) => a.price - b.price)
      .slice(0, 3); // Grab only the top 3
  }, [searchTerm, reports]);

  return (
    <div className="bg-white dark:bg-[#334155] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-900/5 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-2xl">
            <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Price Check</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Market Comparison</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          list="check-items"
          type="text"
          placeholder="Search (e.g. Telur Gred A)"
          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none font-bold transition-all shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <datalist id="check-items">
          {items.map((item, i) => (
            <option key={i} value={item.name} />
          ))}
        </datalist>
      </div>

      {/* Result Area */}
      <div className="space-y-3">
        {topDeals.length > 0 ? (
          topDeals.map((deal, index) => (
            <div 
              key={deal.id} 
              className={`relative flex flex-col p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                index === 0 
                ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' 
                : 'bg-slate-50 border-transparent dark:bg-slate-800/50'
              }`}
            >
              {/* Ranking Badge */}
              <div className="absolute -top-2 -right-2 flex items-center justify-center">
                <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase text-white shadow-lg ${
                  index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-orange-400'
                }`}>
                  <Trophy className="w-3 h-3" /> #{index + 1}
                </span>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`text-2xl font-black ${index === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    RM {deal.price.toFixed(2)}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mt-1 font-bold text-xs">
                    <Store className="w-3.5 h-3.5 text-blue-500" />
                    <span className="uppercase">{deal.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-white/5 mt-1">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    {deal.store_name || 'Official Store'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Reported {new Date(deal.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : searchTerm ? (
          <div className="flex items-center gap-3 p-6 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-2xl text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">No recent reports for this specific item.</p>
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl">
            <div className="flex justify-center mb-3">
              <Search className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Enter item name</p>
            <p className="text-[10px] text-slate-300 mt-1">Compare the best prices in your area</p>
          </div>
        )}
      </div>

      {topDeals.length > 0 && (
        <p className="text-center mt-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Prices are user-contributed
        </p>
      )}
    </div>
  );
};