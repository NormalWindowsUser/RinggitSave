import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useGroceryData = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [priceReports, setPriceReports] = useState([]);
  const [topSavings, setTopSavings] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // 1. Fetch Price Reports
      const { data: reports } = await supabase
        .from('price_reports')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch Real User Count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 3. Process Items for "Price Check"
      const uniqueItems = [...new Set(reports?.map(r => r.item_name) || [])].map(name => ({
        id: name,
        name: name
      }));

      // 4. Calculate Top Savings (Max vs Min price for same item)
      const savingsMap = (reports || []).reduce((acc: any, curr: any) => {
        if (!acc[curr.item_name]) {
          acc[curr.item_name] = { min: curr.price, max: curr.price };
        } else {
          acc[curr.item_name].min = Math.min(acc[curr.item_name].min, curr.price);
          acc[curr.item_name].max = Math.max(acc[curr.item_name].max, curr.price);
        }
        return acc;
      }, {});

      const savingsArray = Object.keys(savingsMap)
        .map(name => ({
          item: name,
          saving: (savingsMap[name].max - savingsMap[name].min).toFixed(2),
          percentage: Math.round(((savingsMap[name].max - savingsMap[name].min) / savingsMap[name].max) * 100)
        }))
        .filter(s => s.percentage > 0)
        .sort((a, b) => b.percentage - a.percentage);

      setPriceReports(reports || []);
      setGroceryItems(uniqueItems);
      setTopSavings(savingsArray);
      setActiveUsers(count || 0);
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Real-time subscription
    const channel = supabase.channel('realtime-reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'price_reports' }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return { groceryItems, priceReports, topSavings, activeUsers, loading };
};