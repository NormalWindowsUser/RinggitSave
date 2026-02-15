import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { 
  ChevronLeft, Trash2, Calendar, MapPin, 
  Loader2, History, ShoppingBag, ArrowUpRight 
} from 'lucide-react';

export const MyActivity = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('price_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching activity:', error);
    else setReports(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    // 1. Force the confirm to trigger
    const confirmed = window.confirm("Delete this report permanently?");
    if (!confirmed) return;

    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('price_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update UI locally
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (error: any) {
      console.error('Delete error:', error.message);
      alert(`Delete Failed: ${error.message}`);
    } finally {
      // Unlock the button regardless of success/fail
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#1e293b]">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent p-6 transition-colors duration-500">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-all group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-[#334155] shadow-sm group-hover:shadow-emerald-500/20 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <History className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">User Ledger</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">My Activity</h2>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-black text-slate-900 dark:text-white">{reports.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Reports</span>
          </div>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#334155] border border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
            <div className="bg-slate-50 dark:bg-[#1e293b] w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Data Found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className={`group relative bg-white dark:bg-[#334155] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-all 
                  ${deletingId === report.id ? 'opacity-50 scale-95' : 'hover:scale-[1.01]'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                      <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight">
                        {report.item_name}
                      </h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-300 font-medium gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 
                        {report.location}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium gap-2">
                        <Calendar className="w-3.5 h-3.5" /> 
                        {new Date(report.created_at).toLocaleDateString('en-MY')}
                      </div>
                    </div>

                    <p className="text-emerald-600 dark:text-emerald-400 font-black text-2xl tracking-tighter">
                      RM {Number(report.price || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* ACTION BUTTON - Fixed Z-index and relative positioning */}
                  <div className="relative z-50 flex flex-col items-center gap-4">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card clicks if you add navigation later
                        handleDelete(report.id);
                      }}
                      disabled={deletingId === report.id}
                      className="p-4 bg-slate-50 dark:bg-[#1e293b] rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all active:scale-90"
                      title="Delete report"
                    >
                      {deletingId === report.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                    <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>

                {/* Decoration Blur - Added pointer-events-none so it doesn't block the button */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};