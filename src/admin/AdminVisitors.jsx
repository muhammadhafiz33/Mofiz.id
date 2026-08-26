import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, X, Shield, Globe, Navigation, Clock, Monitor, ExternalLink, UserPlus, Trash2, RefreshCw } from 'lucide-react';
import { createNewVisitorSession, saveLocalVisitorLog } from '../hooks/useVisitorTracker';

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [search, setSearch] = useState('');

  const fetchVisitors = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem('hafiz_admin_token');

    const getMergedVisitors = (remoteList = []) => {
      try {
        const localLogs = JSON.parse(localStorage.getItem('hafiz_live_visitor_logs') || '[]');
        const map = new Map();

        remoteList.forEach(v => {
          if (v.anonymous_session_id) map.set(v.anonymous_session_id, v);
        });

        localLogs.forEach(v => {
          if (v.anonymous_session_id) {
            const prev = map.get(v.anonymous_session_id) || {};
            const created = prev.created_at || v.created_at || new Date().toISOString();
            const last = v.last_seen || prev.last_seen || created;
            const first = prev.first_seen || v.first_seen || created;

            map.set(v.anonymous_session_id, {
              ...prev,
              ...v,
              id: prev.id || v.id || Date.now(),
              created_at: created,
              first_seen: first,
              last_seen: last
            });
          }
        });

        const getTimestampMs = (v) => {
          const raw = v.last_seen || v.created_at || v.first_seen;
          if (raw) {
            const ms = new Date(raw).getTime();
            if (!isNaN(ms)) return ms;
          }
          return Number(v.id) || 0;
        };

        // Return array sorted by newest last_seen or created_at descending (top to bottom)
        return Array.from(map.values()).sort((a, b) => getTimestampMs(b) - getTimestampMs(a));
      } catch (e) {
        return remoteList;
      }
    };

    fetch('/api/admin/visitors', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setVisitors(getMergedVisitors(data.visitors || []));
        setLoading(false);
      })
      .catch(() => {
        setVisitors(getMergedVisitors([]));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // Handler: Simulate New Visitor Session for testing
  const handleSimulateVisitor = () => {
    const newSessionId = createNewVisitorSession();
    const cities = [
      { city: 'Jakarta', country: 'Indonesia', ip: '114.122.208.' + Math.floor(Math.random() * 250), isp: 'PT Indosat Tbk' },
      { city: 'Surabaya', country: 'Indonesia', ip: '180.252.164.' + Math.floor(Math.random() * 250), isp: 'PT Telekomunikasi Indonesia' },
      { city: 'Bandung', country: 'Indonesia', ip: '118.99.112.' + Math.floor(Math.random() * 250), isp: 'PT XL Axiata Tbk' },
      { city: 'Singapore', country: 'Singapore', ip: '128.199.200.' + Math.floor(Math.random() * 250), isp: 'DigitalOcean Cloud' },
      { city: 'Tokyo', country: 'Japan', ip: '153.120.44.' + Math.floor(Math.random() * 250), isp: 'NTT Communications' }
    ];
    const pick = cities[Math.floor(Math.random() * cities.length)];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const osList = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];

    const newLog = {
      anonymous_session_id: newSessionId,
      ip_address: pick.ip,
      country: pick.country,
      estimated_city: pick.city,
      isp: pick.isp,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      operating_system: osList[Math.floor(Math.random() * osList.length)],
      device_type: devices[Math.floor(Math.random() * devices.length)],
      referrer: Math.random() > 0.5 ? 'https://google.com' : 'Direct',
      page: '/',
      page_views: ['/'],
      location_source: 'Estimated IP Location'
    };

    saveLocalVisitorLog(newLog);

    // Send to backend
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anonymous_session_id: newSessionId,
        client_public_ip: pick.ip,
        page: '/',
        referrer: newLog.referrer
      })
    }).finally(() => {
      fetchVisitors();
    });
  };

  // Handler: Reset local visitor logs
  const handleClearLogs = () => {
    if (window.confirm('Clear all visitor logs from local storage?')) {
      localStorage.removeItem('hafiz_live_visitor_logs');
      fetchVisitors();
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    const pagesStr = Array.isArray(v.page_views) ? v.page_views.join(' ') : (v.page || '');
    const dateStr = v.created_at ? new Date(v.created_at).toLocaleString() : '';
    const gpsStr = v.gps ? `${v.gps.latitude} ${v.gps.longitude}` : '';

    return (
      (v.anonymous_session_id || '').toLowerCase().includes(query) ||
      (v.ip_address || '').toLowerCase().includes(query) ||
      (v.country || '').toLowerCase().includes(query) ||
      (v.estimated_city || '').toLowerCase().includes(query) ||
      (v.isp || '').toLowerCase().includes(query) ||
      (v.browser || '').toLowerCase().includes(query) ||
      (v.operating_system || '').toLowerCase().includes(query) ||
      (v.device_type || '').toLowerCase().includes(query) ||
      (v.referrer || '').toLowerCase().includes(query) ||
      (v.location_source || '').toLowerCase().includes(query) ||
      pagesStr.toLowerCase().includes(query) ||
      dateStr.toLowerCase().includes(query) ||
      gpsStr.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Loading visitor log records...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            Visitor Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {filteredVisitors.length} / {visitors.length} Logged
            </span>
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">Detailed visitor session logs, multi-field search & location tracking.</p>
        </div>

        {/* Action Controls & Search */}
        <div className="flex flex-wrap items-center gap-2 max-w-lg w-full justify-start md:justify-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search IP, session, city, browser, ISP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            onClick={fetchVisitors}
            title="Refresh List"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={handleSimulateVisitor}
            className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-mono font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95"
          >
            <UserPlus size={14} />
            <span>Simulate Visitor</span>
          </button>

          <button
            onClick={handleClearLogs}
            title="Clear Local Storage Logs"
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Visitor Table */}
      <div className="rounded-2xl border bg-gray-950/60 p-6 overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3">Session ID</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3">Estimated City</th>
                <th className="py-3 px-3">Device</th>
                <th className="py-3 px-3">Browser</th>
                <th className="py-3 px-3">OS</th>
                <th className="py-3 px-3">Referrer</th>
                <th className="py-3 px-3">Location Source</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-6 text-center text-gray-500">No visitor records matching query.</td>
                </tr>
              ) : (
                filteredVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-gray-500 text-[11px] whitespace-nowrap">
                      {new Date(v.created_at).toLocaleDateString()}{' '}
                      <span className="text-gray-400">{new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-400 whitespace-nowrap font-mono">{v.ip_address || '127.0.0.1'}</td>
                    <td className="py-3 px-3 text-blue-400 font-semibold">{v.anonymous_session_id}</td>
                    <td className="py-3 px-3 text-white whitespace-nowrap">{v.country}</td>
                    <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{v.estimated_city}</td>
                    <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{v.device_type}</td>
                    <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{v.browser}</td>
                    <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{v.operating_system}</td>
                    <td className="py-3 px-3 text-gray-500 truncate max-w-[120px]">{v.referrer}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] border ${
                          v.location_source === 'Browser GPS Location'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : v.location_source === 'Estimated IP Location'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        {v.location_source}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedVisitor(v)}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye size={13} />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Detail Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="max-w-lg w-full rounded-2xl border bg-gray-950 p-6 text-left shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => setSelectedVisitor(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl border border-white/5 hover:border-white/20 transition-all"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">Visitor Session Detail</h3>
                <div className="flex items-center gap-2 mt-0.5 font-mono text-xs">
                  <span className="text-emerald-400 font-semibold">{selectedVisitor.ip_address || '127.0.0.1'}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-blue-400 font-semibold">{selectedVisitor.anonymous_session_id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Session Overview */}
              <div className="grid grid-cols-2 gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                    <Clock size={12} className="text-blue-400" /> First Seen
                  </span>
                  <p className="text-white mt-1 text-[11px]">{new Date(selectedVisitor.first_seen).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                    <Clock size={12} className="text-emerald-400" /> Last Seen
                  </span>
                  <p className="text-white mt-1 text-[11px]">{new Date(selectedVisitor.last_seen).toLocaleString()}</p>
                </div>
              </div>

              {/* System Specs */}
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <h4 className="text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-bold border-b border-white/5 pb-2">
                  <Monitor size={14} className="text-purple-400" /> System & Environment
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500">Device:</span> <span className="text-white">{selectedVisitor.device_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Browser:</span> <span className="text-white">{selectedVisitor.browser}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Operating System:</span> <span className="text-white">{selectedVisitor.operating_system}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Referrer:</span> <span className="text-white">{selectedVisitor.referrer}</span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 ${
                  selectedVisitor.gps
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <h4
                  className={`text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-bold border-b pb-2 ${
                    selectedVisitor.gps ? 'text-emerald-400 border-emerald-500/20' : 'text-blue-400 border-blue-500/20'
                  }`}
                >
                  {selectedVisitor.gps ? <Navigation size={14} /> : <Globe size={14} />}
                  Location Details ({selectedVisitor.location_source})
                </h4>

                {selectedVisitor.gps ? (
                  <div className="space-y-2 text-[11px] text-emerald-200 font-mono">
                    <div className="flex justify-between">
                      <span className="text-emerald-400/70">Latitude:</span>
                      <span className="font-semibold text-white">{selectedVisitor.gps.latitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400/70">Longitude:</span>
                      <span className="font-semibold text-white">{selectedVisitor.gps.longitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400/70">Accuracy Radius:</span>
                      <span>±{Math.round(selectedVisitor.gps.accuracy || 0)} meters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400/70">GPS Timestamp:</span>
                      <span>{new Date(selectedVisitor.gps.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-emerald-500/20 flex justify-end">
                      <a
                        href={`https://www.google.com/maps?q=${selectedVisitor.gps.latitude},${selectedVisitor.gps.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-[11px] transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                      >
                        <ExternalLink size={13} />
                        <span>Open Coordinates in Google Maps</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-[11px] text-blue-200 font-mono">
                    <div className="flex justify-between">
                      <span className="text-blue-400/70">Estimated Country:</span>
                      <span className="text-white">{selectedVisitor.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400/70">Estimated City:</span>
                      <span className="text-white">{selectedVisitor.estimated_city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400/70">ISP Provider:</span>
                      <span>{selectedVisitor.isp}</span>
                    </div>
                    <div className="pt-2 border-t border-blue-500/20 flex justify-end">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedVisitor.estimated_city !== 'Unknown' ? selectedVisitor.estimated_city + ', ' : '') + selectedVisitor.country)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-[11px] transition-all shadow-md shadow-blue-500/20 active:scale-95"
                      >
                        <ExternalLink size={13} />
                        <span>Open City in Google Maps</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Pages Viewed */}
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <h4 className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                  Pages Viewed ({selectedVisitor.page_views?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVisitor.page_views?.length ? (
                    selectedVisitor.page_views.map((pg, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-white/10 text-white text-[10px]">
                        {pg}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-[11px]">/</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
