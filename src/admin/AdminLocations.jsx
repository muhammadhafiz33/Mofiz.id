import { useEffect, useState } from 'react';
import { MapPin, Navigation, Globe, ExternalLink } from 'lucide-react';

export default function AdminLocations() {
  const [ipLocations, setIpLocations] = useState([]);
  const [gpsLocations, setGpsLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hafiz_admin_token');
    fetch('/api/admin/locations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setIpLocations(data.ipLocations || []);
        setGpsLocations(data.gpsLocations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load location data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Loading location monitoring data...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-xl font-bold font-mono text-white">Location Monitoring</h2>
        <p className="text-xs text-gray-400 font-mono mt-1">
          Separated monitoring for Estimated IP Geolocation vs Permission-Granted Browser GPS Data.
        </p>
      </div>

      {/* Section A: Estimated IP Location */}
      <div className="rounded-2xl border bg-gray-950/60 p-6 space-y-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">Estimated IP Location</h3>
              <p className="text-[11px] text-gray-400 font-mono">Approximate network location based on IP address</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {ipLocations.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-3">Session ID</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3">Estimated City</th>
                <th className="py-3 px-3">ISP</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Maps Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ipLocations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">No estimated IP locations recorded yet.</td>
                </tr>
              ) : (
                ipLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-blue-400 font-semibold">{loc.anonymous_session_id}</td>
                    <td className="py-3 px-3 text-white">{loc.country}</td>
                    <td className="py-3 px-3 text-gray-300">{loc.estimated_city}</td>
                    <td className="py-3 px-3 text-gray-400">{loc.isp}</td>
                    <td className="py-3 px-3 text-gray-500 text-[11px]">{new Date(loc.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((loc.estimated_city !== 'Unknown' ? loc.estimated_city + ', ' : '') + loc.country)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] transition-all font-mono"
                      >
                        <ExternalLink size={11} />
                        <span>Google Maps</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section B: Browser GPS Location */}
      <div className="rounded-2xl border bg-gray-950/60 p-6 space-y-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Navigation size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">Browser GPS Location</h3>
              <p className="text-[11px] text-emerald-400/80 font-mono">Explicit user-granted Geolocation API coordinates</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {gpsLocations.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-3">Session ID</th>
                <th className="py-3 px-3">Latitude</th>
                <th className="py-3 px-3">Longitude</th>
                <th className="py-3 px-3">Accuracy (m)</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Location Source</th>
                <th className="py-3 px-3 text-right">Maps Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gpsLocations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">No Browser GPS locations permission granted yet.</td>
                </tr>
              ) : (
                gpsLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-emerald-400 font-semibold">{loc.anonymous_session_id}</td>
                    <td className="py-3 px-3 text-white font-mono">{Number(loc.latitude).toFixed(6)}</td>
                    <td className="py-3 px-3 text-white font-mono">{Number(loc.longitude).toFixed(6)}</td>
                    <td className="py-3 px-3 text-gray-300">±{Math.round(loc.accuracy || 0)}m</td>
                    <td className="py-3 px-3 text-gray-500 text-[11px]">{new Date(loc.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        Browser GPS Location
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] transition-all font-mono font-semibold"
                      >
                        <ExternalLink size={11} />
                        <span>Open Maps</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
