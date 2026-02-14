import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { 
  Trash2, Plus, Database, ShoppingBasket, 
  MapPin, Loader2, Users, ShieldAlert, 
  Ban, CheckCircle, Crown, Mail, Globe, Search, ChevronDown, AlertTriangle, Calendar,
  Store, User as UserIcon
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [reports, setReports] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Inputs
  const [newItem, setNewItem] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');

  // Filters & Pagination
  const [userSearch, setUserSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [filterState, setFilterState] = useState(''); 
  const [userLimit, setUserLimit] = useState(6);
  const [reportLimit, setReportLimit] = useState(100); // Increased limit since we use a scroll area now

  const ADMIN_EMAIL = 'admin@gmail.com';

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/');
        return;
      }

      const { data: f } = await supabase
        .from('report_flags')
        .select(`*, price_reports(*, profiles(email))`)
        .order('created_at', { ascending: false });
      setFlags(f || []);

      const { data: s } = await supabase.from('states').select('*').order('name');
      setStates(s || []);

      const { data: r, error: reportError } = await supabase
        .from('price_reports')
        .select(`*, profiles!left (email)`)
        .order('created_at', { ascending: false });
      if (reportError) throw reportError;
      setReports(r || []);

      const { data: i } = await supabase.from('official_items').select('*').order('name');
      const { data: l } = await supabase.from('official_locations').select(`*, states(name)`).order('name');
      const { data: u } = await supabase.from('profiles').select('*').order('email');
      
      setItems(i || []);
      setLocations(l || []);
      setUsers(u || []);
    } catch (error: any) {
      console.error("Fetch Data Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- ACTIONS WITH DATABASE VALIDATION ---

  const dismissFlag = async (flagId: string) => {
    const { error } = await supabase.from('report_flags').delete().eq('id', flagId);
    if (error) {
      console.error("Delete failed in DB:", error);
      alert(`DB Error: ${error.message}`);
    } else {
      setFlags(prev => prev.filter(f => f.id !== flagId));
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Permanently delete this report and all associated flags?')) return;
    const { error } = await supabase.from('price_reports').delete().eq('id', reportId);
    if (error) {
      console.error("Delete failed in DB:", error);
      alert(`DB Error: ${error.message}`);
    } else {
      setReports(prev => prev.filter(r => r.id !== reportId));
      setFlags(prev => prev.filter(f => f.report_id !== reportId));
    }
  };

  const addOfficialItem = async () => {
    if (!newItem) return;
    await supabase.from('official_items').insert([{ name: newItem }]);
    setNewItem(''); fetchData();
  };

  const addOfficialLocation = async () => {
    if (!newLocation || !selectedStateId) return;
    await supabase.from('official_locations').insert([{ name: newLocation, state_id: selectedStateId }]);
    setNewLocation(''); fetchData();
  };

  const deleteOfficialItem = async (id: string) => {
    if (confirm('Delete?')) { await supabase.from('official_items').delete().eq('id', id); fetchData(); }
  };

  const deleteOfficialLocation = async (id: string) => {
    if (confirm('Delete?')) { await supabase.from('official_locations').delete().eq('id', id); fetchData(); }
  };

  const toggleBan = async (userId: string, currentStatus: boolean, userEmail: string) => {
    if (userEmail === ADMIN_EMAIL) return;
    const { error } = await supabase.from('profiles').update({ is_banned: !currentStatus }).eq('id', userId);
    if (error) alert(error.message);
    fetchData();
  };

  // --- FILTERS ---
  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const displayedUsers = filteredUsers.slice(0, userLimit);
  const filteredReports = reports.filter(r => {
    const matchesSearch = (r.profiles?.email || '').toLowerCase().includes(reportSearch.toLowerCase()) || 
                          r.item_name.toLowerCase().includes(reportSearch.toLowerCase());
    const matchesState = filterState ? r.state_id === filterState : true;
    return matchesSearch && matchesState;
  });
  const displayedReports = filteredReports.slice(0, reportLimit);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 pb-32 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <header className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Admin Control</h1>
          <p className="text-gray-500 dark:text-gray-400 italic font-medium">{ADMIN_EMAIL}</p>
        </div>
      </header>

      {/* METADATA SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 font-bold text-gray-800 dark:text-gray-100 text-lg">
            <ShoppingBasket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Items
          </div>
          <div className="flex gap-2 mb-6">
            <input 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)} 
              placeholder="Add item..." 
              className="flex-grow p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none dark:text-white dark:placeholder-gray-500" 
            />
            <button onClick={addOfficialItem} className="bg-emerald-600 dark:bg-emerald-500 text-white px-4 rounded-xl hover:opacity-90 transition-opacity"><Plus /></button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">{item.name}</span>
                <button onClick={() => deleteOfficialItem(item.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 font-bold text-gray-800 dark:text-gray-100 text-lg">
            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Stores
          </div>
          <div className="space-y-3 mb-6">
            <input 
              value={newLocation} 
              onChange={(e) => setNewLocation(e.target.value)} 
              placeholder="Store Name" 
              className="w-full p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white dark:placeholder-gray-500" 
            />
            <div className="flex gap-2">
              <select 
                value={selectedStateId} 
                onChange={(e) => setSelectedStateId(e.target.value)} 
                className="flex-grow p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white"
              >
                <option value="">Select State...</option>
                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={addOfficialLocation} className="bg-purple-600 dark:bg-purple-500 text-white px-6 rounded-xl hover:opacity-90 transition-opacity"><Plus /></button>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {locations.map(loc => (
              <div key={loc.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">{loc.name}</span>
                  <span className="text-[10px] text-purple-500 dark:text-purple-400 font-black uppercase tracking-widest">{loc.states?.name}</span>
                </div>
                <button onClick={() => deleteOfficialLocation(loc.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* USER LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-900 dark:bg-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg"><Users className="w-5 h-5" /> Users</div>
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search full email..." 
              value={userSearch} 
              onChange={(e) => setUserSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 bg-slate-800 dark:bg-slate-700 border-none rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedUsers.map(u => (
              <div key={u.id} className={`p-4 rounded-2xl border ${u.is_banned ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' : 'bg-gray-50 dark:bg-slate-800/40 border-transparent dark:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-full pr-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white break-all leading-tight">{u.email}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${u.is_banned ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                      {u.email === ADMIN_EMAIL ? 'Super Admin' : (u.is_banned ? 'Banned' : 'Active')}
                    </p>
                  </div>
                  {u.email === ADMIN_EMAIL && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                </div>
                {u.email !== ADMIN_EMAIL && (
                  <button onClick={() => toggleBan(u.id, u.is_banned, u.email)} className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${u.is_banned ? 'bg-emerald-600 dark:bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-500'}`}>
                    {u.is_banned ? 'Unban' : 'Ban'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MASTER PRICE TABLE - MODIFIED FOR SCROLLING */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-900 dark:bg-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg"><Database className="w-5 h-5 text-blue-400" /> Master Price Logs</div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <select 
              className="bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl px-4 py-2 border-none outline-none focus:ring-1 focus:ring-blue-500" 
              onChange={(e) => setFilterState(e.target.value)} 
              value={filterState}
            >
              <option value="">All Regions</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={reportSearch} 
                onChange={(e) => setReportSearch(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-slate-800 dark:bg-slate-700 border-none rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>
        
        {/* Fixed Height Scroll Container */}
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
                <th className="p-4">Time</th>
                <th className="p-4">Item</th>
                <th className="p-4">Price</th>
                <th className="p-4">Location</th>
                <th className="p-4">User</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {displayedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{new Date(report.created_at).toLocaleDateString('en-MY')}</div>
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white text-sm uppercase">{report.item_name}</td>
                  <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">RM {report.price.toFixed(2)}</td>
                  <td className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                    {report.location} <span className="text-[9px] text-gray-400 dark:text-gray-500 ml-1">({states.find(s => s.id === report.state_id)?.name})</span>
                  </td>
                  <td className="p-4 text-[11px] font-bold text-gray-500 dark:text-gray-500 break-all">{report.profiles?.email || 'N/A'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteReport(report.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayedReports.length === 0 && (
            <div className="p-10 text-center text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">
              No matching records found
            </div>
          )}
        </div>
      </div>

      {/* COMMUNITY FLAGS SECTION (At Bottom) */}
      <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Community Moderation ({flags.length})</h2>
        </div>

        {flags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flags.map((flag) => (
              <div key={flag.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-amber-100 dark:border-amber-900/30 shadow-xl shadow-amber-900/5 relative overflow-hidden flex flex-col justify-between transition-colors">
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-900/10 px-3 py-2 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Reason</p>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200 italic">"{flag.reason}"</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase"><ShoppingBasket className="w-3 h-3 inline mr-1"/> Item</p>
                        <p className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase">{flag.price_reports?.item_name || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Flagged Price</p>
                        <p className="text-sm font-black text-red-600 dark:text-red-400">RM {flag.price_reports?.price?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase"><Store className="w-3 h-3 inline mr-1"/> Shop</p>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">{flag.price_reports?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase"><UserIcon className="w-3 h-3 inline mr-1"/> Original Poster</p>
                      <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 break-all bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-100 dark:border-slate-700">{flag.price_reports?.profiles?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    onClick={() => deleteReport(flag.report_id)}
                    className="flex-grow py-3 bg-red-600 dark:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-all shadow-lg shadow-red-200 dark:shadow-none"
                  >
                    Delete Bad Report
                  </button>
                  <button 
                    onClick={() => dismissFlag(flag.id)}
                    className="px-6 py-3 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-2 border-gray-100 dark:border-slate-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 p-12 rounded-[40px] text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 dark:text-emerald-500 mx-auto mb-4" />
            <p className="text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-widest text-sm">No active flags</p>
          </div>
        )}
      </div>
    </div>
  );
};