import { useEffect, useState } from 'react';
import { Users, Calendar, Eye, FileText, Monitor, Globe, Cpu, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hafiz_admin_token');

    const getLocalAnalyticsSummary = () => {
      try {
        const logs = JSON.parse(localStorage.getItem('hafiz_live_visitor_logs') || '[]');
        const totalVisitors = logs.length;
        const now = new Date();
        const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgoStr = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgoStr = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const visitorsToday = logs.filter(v => (v.created_at || v.first_seen) >= todayStr).length;
        const visitorsWeek = logs.filter(v => (v.created_at || v.first_seen) >= weekAgoStr).length;
        const visitorsMonth = logs.filter(v => (v.created_at || v.first_seen) >= monthAgoStr).length;

        const deviceMap = {};
        const browserMap = {};
        const osMap = {};

        logs.forEach(v => {
          if (v.device_type) deviceMap[v.device_type] = (deviceMap[v.device_type] || 0) + 1;
          if (v.browser) browserMap[v.browser] = (browserMap[v.browser] || 0) + 1;
          if (v.operating_system) osMap[v.operating_system] = (osMap[v.operating_system] || 0) + 1;
        });

        return {
          totalVisitors,
          visitorsToday,
          visitorsWeek,
          visitorsMonth,
          totalPageViews: logs.length,
          mostVisitedPage: '/',
          devices: Object.entries(deviceMap).map(([device_type, count]) => ({ device_type, count })),
          browsers: Object.entries(browserMap).map(([browser, count]) => ({ browser, count })),
          osList: Object.entries(osMap).map(([operating_system, count]) => ({ operating_system, count }))
        };
      } catch (e) {
        return {
          totalVisitors: 0, visitorsToday: 0, visitorsWeek: 0, visitorsMonth: 0, totalPageViews: 0,
          mostVisitedPage: '/', devices: [], browsers: [], osList: []
        };
      }
    };

    fetch('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData && !resData.error && typeof resData.totalVisitors === 'number') {
          setData(resData);
        } else {
          setData(getLocalAnalyticsSummary());
        }
        setLoading(false);
      })
      .catch(() => {
        setData(getLocalAnalyticsSummary());
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Loading analytics dashboard...
      </div>
    );
  }

  const activeData = data || {
    totalVisitors: 0,
    visitorsToday: 0,
    visitorsWeek: 0,
    visitorsMonth: 0,
    totalPageViews: 0,
    mostVisitedPage: '/',
    devices: [],
    browsers: [],
    osList: []
  };

  const statCards = [
    { title: 'Total Visitors', value: activeData.totalVisitors || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Visitors Today', value: activeData.visitorsToday || 0, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Visitors This Week', value: activeData.visitorsWeek || 0, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Visitors This Month', value: activeData.visitorsMonth || 0, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Total Page Views', value: activeData.totalPageViews || 0, icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Most Visited Page', value: activeData.mostVisitedPage || '/', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const renderBreakdown = (title, items, keyField, icon) => {
    const total = items.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const IconComponent = icon;

    return (
      <div className="rounded-2xl border bg-gray-950/60 p-6 space-y-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <IconComponent size={16} className="text-blue-400" />
            {title}
          </h3>
          <span className="text-[10px] font-mono text-gray-500 uppercase">{items.length} Categorized</span>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-xs text-gray-500 font-mono">No data recorded yet.</p>
          ) : (
            items.map((item, idx) => {
              const label = item[keyField] || 'Other';
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={idx} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="font-medium">{label}</span>
                    <span className="text-gray-400 text-[11px]">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-xl font-bold font-mono text-white">Analytics Overview</h2>
        <p className="text-xs text-gray-400 font-mono mt-1">Real-time visitor performance and traffic metrics.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border bg-gray-950/60 backdrop-blur-xl flex items-center justify-between transition-all hover:border-blue-500/30"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="space-y-1">
                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-bold font-mono text-white">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color} border border-white/5`}>
                <IconComponent size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderBreakdown('Device Types', data.devices || [], 'device_type', Monitor)}
        {renderBreakdown('Browsers', data.browsers || [], 'browser', Globe)}
        {renderBreakdown('Operating Systems', data.osList || [], 'operating_system', Cpu)}
      </div>
    </div>
  );
}
