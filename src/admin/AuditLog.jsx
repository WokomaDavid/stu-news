import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import AdminHeader from './AdminHeader';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <AdminHeader title="Audit Logs" />
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="border p-2 rounded">
            <p><strong>Action:</strong> {log.action}</p>
            <p><strong>Target:</strong> {log.target}</p>
            <p><strong>Time:</strong> {new Date(log.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLog;
