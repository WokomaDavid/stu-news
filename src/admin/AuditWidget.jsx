import { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';

const AuditWidget = ({ initialLimit = 10 }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(false);

  // filters
  const [actionFilter, setActionFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [selectedLog, setSelectedLog] = useState(null);

  const subscriptionRef = useRef(null);

  const buildQuery = (query) => {
    if (actionFilter) query = query.ilike('action', `%${actionFilter}%`);
    if (actorFilter) query = query.eq('actor_id', actorFilter);
    if (dateFrom) query = query.gte('created_at', new Date(dateFrom).toISOString());
    if (dateTo) query = query.lte('created_at', new Date(dateTo).toISOString());
    return query;
  };

  const fetchLogs = async ({ reset = false, p = page } = {}) => {
    setLoading(true);
    try {
      const start = (p - 1) * pageSize;
      const end = p * pageSize - 1;
      let query = supabase.from('audit_logs').select('*');
      query = query.order('created_at', { ascending: false });
      query = buildQuery(query);
      const { data, error } = await query.range(start, end);
      if (!error) {
        if (reset) setLogs(data || []);
        else setLogs((prev) => [...prev, ...(data || [])]);
        setHasMore((data || []).length === pageSize);
      }
    } catch (err) {
      // surface fetch issues to aid debugging
      // eslint-disable-next-line no-console
      console.error('fetchLogs error', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // initial load or when filters change -> reset page
    setPage(1);
    fetchLogs({ reset: true, p: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, actorFilter, dateFrom, dateTo]);

  useEffect(() => {
    // setup realtime subscription for new audit_logs
    try {
      const sub = supabase
        .channel('public:audit_logs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
          const newLog = payload.new || payload;
          // apply filters locally: if it matches current filters, prepend
          const matchesAction = !actionFilter || (newLog.action || '').toLowerCase().includes(actionFilter.toLowerCase());
          const matchesActor = !actorFilter || (String(newLog.actor_id || '') === String(actorFilter));
          const createdAt = new Date(newLog.created_at);
          const matchesFrom = !dateFrom || createdAt >= new Date(dateFrom);
          const matchesTo = !dateTo || createdAt <= new Date(dateTo);
          if (matchesAction && matchesActor && matchesFrom && matchesTo) {
            setLogs((prev) => [newLog, ...prev]);
          }
        })
        .subscribe();

      subscriptionRef.current = sub;
    } catch (err) {
      // fallback: ignore realtime if API mismatch
      // eslint-disable-next-line no-console
      console.warn('realtime subscribe error', err);
    }

    return () => {
      try {
        if (subscriptionRef.current && typeof subscriptionRef.current.unsubscribe === 'function') {
          subscriptionRef.current.unsubscribe();
        } else if (subscriptionRef.current) {
          // supabase v2 channel returns object with 'remove' on client; attempt to remove
          // best-effort cleanup; ignore errors
          try { supabase.removeChannel?.(subscriptionRef.current); } catch (err) { /* eslint-disable-line no-console */ }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('cleanup subscription error', err);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, actorFilter, dateFrom, dateTo]);

  const loadMore = async () => {
    const next = page + 1;
    setPage(next);
    await fetchLogs({ reset: false, p: next });
  };

  const resetFilters = () => {
    setActionFilter('');
    setActorFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 shadow">
      <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>

      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} placeholder="Filter by action (e.g. add_student)" className="input input-sm" />
        <input value={actorFilter} onChange={(e) => setActorFilter(e.target.value)} placeholder="Filter by actor id" className="input input-sm" />
        <div className="flex gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input input-sm" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input input-sm" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setPage(1); fetchLogs({ reset: true, p: 1 }); }} className="btn btn-sm btn-primary">Apply</button>
          <button type="button" onClick={() => { resetFilters(); setPage(1); fetchLogs({ reset: true, p: 1 }); }} className="btn btn-sm">Reset</button>
        </div>
      </div>

      {loading && <div className="p-2">Loading...</div>}

      <ul className="space-y-2 max-h-64 overflow-auto text-sm">
        {logs.map((log) => (
          <li key={log.id} className="border-b last:border-b-0 pb-2">
            <div className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</div>
            <div className="flex items-center justify-between">
              <div><strong>{log.action}</strong> — target: {String(log.target)}</div>
              <div className="flex items-center gap-2">
                {log.actor_id && <span className="text-xs text-gray-600">By: {log.actor_id}</span>}
                <button onClick={() => setSelectedLog(log)} className="text-sm text-primary hover:underline">View details</button>
              </div>
            </div>
            {selectedLog && selectedLog.id === log.id && (
              <div className="mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs">
                <pre className="whitespace-pre-wrap">{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-center">
        {hasMore ? (
          <button onClick={loadMore} className="btn btn-sm btn-outline">Load more</button>
        ) : (
          <div className="text-xs text-gray-500">No more logs</div>
        )}
      </div>
    </div>
  );
};

export default AuditWidget;
