import { useEffect, useState } from 'react';
import { Users, Calendar, Eye, FileText, Monitor, Globe, Cpu, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hafiz_admin_token');
    fetch('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
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

  if (!data) {
    return (
      <div className="text-red-400 font-mono text-xs p-4 border border-red-500/20 bg-red-500/10 rounded-2xl">
        Failed to fetch analytics data.
      </div>
    );
  }

  const statCards = [
    { title: 'Total Visitors', value: data.totalVisitors || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Visitors Today', value: data.visitorsToday || 0, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Visitors This Week', value: data.visitorsWeek || 0, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Visitors This Month', value: data.visitorsMonth || 0, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Total Page Views', value: data.totalPageViews || 0, icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Most Visited Page', value: data.mostVisitedPage || '/', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
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
