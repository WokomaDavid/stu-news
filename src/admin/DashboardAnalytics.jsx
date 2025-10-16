import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import AdminHeader from './AdminHeader';

const DashboardAnalytics = () => {
  const [stats, setStats] = useState({
    announcements: 0,
    students: 0,
    results: 0,
    admins: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [a, s, r, ad] = await Promise.all([
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('results').select('*', { count: 'exact', head: true }),
        supabase.from('admins').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        announcements: a.count || 0,
        students: s.count || 0,
        results: r.count || 0,
        admins: ad.count || 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <AdminHeader />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="bg-blue-100 p-4 rounded shadow">📢 Announcements: {stats.announcements}</div>
        <div className="bg-green-100 p-4 rounded shadow">🎓 Students: {stats.students}</div>
        <div className="bg-yellow-100 p-4 rounded shadow">📊 Results: {stats.results}</div>
        <div className="bg-purple-100 p-4 rounded shadow">🛡️ Admins: {stats.admins}</div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
