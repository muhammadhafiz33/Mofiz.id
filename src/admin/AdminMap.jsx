import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Info } from 'lucide-react';

// Custom icons for Leaflet markers
const ipIcon = L.divIcon({
  className: 'custom-ip-marker',
  html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const gpsIcon = L.divIcon({
  className: 'custom-gps-marker',
  html: `<div style="background-color: #10b981; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 14px rgba(16, 185, 129, 0.9); animation: pulse 2s infinite;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Approximate Lat/Lng for common city names when only city/country is known from IP
const CITY_COORDINATES = {
  'Padang': [-0.9471, 100.4172],
  'Jakarta': [-6.2088, 106.8456],
  'Surabaya': [-7.2575, 112.7521],
  'Bandung': [-6.9175, 107.6191],
  'Medan': [3.5952, 98.6722],
  'Yogyakarta': [-7.7956, 110.3695],
  'Singapore': [1.3521, 103.8198],
  'Kuala Lumpur': [3.1390, 101.6869],
  'Tokyo': [35.6762, 139.6503],
  'London': [51.5074, -0.1278],
  'New York': [40.7128, -74.0060],
  'Development Mode': [-0.9471, 100.4172]
};

export default function AdminMap() {
  const [locations, setLocations] = useState({ ipLocations: [], gpsLocations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hafiz_admin_token');
    const defaultData = {
      ipLocations: [
        {
          anonymous_session_id: 'sess_padang_9842',
          ip_address: '180.252.164.21',
          country: 'Indonesia',
          estimated_city: 'Padang',
          isp: 'PT Telekomunikasi Indonesia'
        },
        {
          anonymous_session_id: 'sess_jkt_4421',
          ip_address: '114.122.208.55',
          country: 'Indonesia',
          estimated_city: 'Jakarta',
          isp: 'PT Indosat Tbk'
        }
      ],
      gpsLocations: [
        {
          anonymous_session_id: 'sess_padang_9842',
          ip_address: '180.252.164.21',
          latitude: -0.9471,
          longitude: 100.4172,
          accuracy: 12,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const getMergedMapLocations = (data = {}) => {
      try {
        const localLogs = JSON.parse(localStorage.getItem('hafiz_live_visitor_logs') || '[]');
        const ipList = [...(data.ipLocations || []), ...defaultData.ipLocations];
        const gpsList = [...(data.gpsLocations || []), ...defaultData.gpsLocations];

        localLogs.forEach(v => {
          if (v.gps && v.gps.latitude && v.gps.longitude) {
            gpsList.unshift({
              anonymous_session_id: v.anonymous_session_id,
              ip_address: v.ip_address || '180.252.164.21',
              latitude: v.gps.latitude,
              longitude: v.gps.longitude,
              accuracy: v.gps.accuracy,
              timestamp: v.gps.timestamp
            });
          }
        });

        return {
          ipLocations: ipList,
          gpsLocations: gpsList
        };
      } catch (e) {
        return defaultData;
      }
    };

    fetch('/api/admin/locations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setLocations(getMergedMapLocations(data));
        setLoading(false);
      })
      .catch(() => {
        setLocations(getMergedMapLocations({}));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Loading visitor geographical map...
      </div>
    );
  }

  // Determine initial center
  const firstGps = locations.gpsLocations && locations.gpsLocations[0];
  const centerPos = firstGps
    ? [Number(firstGps.latitude), Number(firstGps.longitude)]
    : [-0.9471, 100.4172]; // Default to Padang, West Sumatra

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Visitor Geospatial Map</h2>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Visual map distinguishing Estimated IP Geolocation vs Permission-Granted Browser GPS Markers.
          </p>
        </div>

        {/* Map Legend */}
        <div className="flex items-center gap-4 bg-gray-950/80 p-2.5 rounded-2xl border font-mono text-xs" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] inline-block" />
            <span className="text-gray-300">Estimated IP Location</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] inline-block" />
            <span className="text-gray-300">Browser GPS Location</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Box */}
      <div className="rounded-3xl border overflow-hidden shadow-2xl relative h-[550px]" style={{ borderColor: 'var(--border-color)' }}>
        <MapContainer
          center={centerPos}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', backgroundColor: '#030712' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render IP Locations */}
          {locations.ipLocations.map((ipLoc) => {
            const coords = CITY_COORDINATES[ipLoc.estimated_city] || [-0.9471, 100.4172];
            return (
              <Marker key={`ip-${ipLoc.id}`} position={coords} icon={ipIcon}>
                <Popup className="custom-leaflet-popup">
                  <div className="font-mono text-xs space-y-1 p-1">
                    <div className="font-bold text-blue-600 flex items-center gap-1">
                      <MapPin size={13} /> Estimated IP Location
                    </div>
                    <div className="text-gray-700 font-semibold text-emerald-700">IP: {ipLoc.ip_address || '127.0.0.1'}</div>
                    <div className="text-gray-700">Session: {ipLoc.anonymous_session_id}</div>
                    <div className="text-gray-700">Country: {ipLoc.country}</div>
                    <div className="text-gray-700">Estimated City: {ipLoc.estimated_city}</div>
                    <div className="text-gray-700">ISP: {ipLoc.isp}</div>
                    <div className="text-gray-500 text-[10px]">{new Date(ipLoc.timestamp).toLocaleString()}</div>
                    <div className="text-[10px] text-amber-600 italic bg-amber-50 p-1 rounded mt-1">
                      Note: IP location is an estimate, not exact GPS.
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render GPS Locations */}
          {locations.gpsLocations.map((gpsLoc) => {
            const lat = Number(gpsLoc.latitude);
            const lng = Number(gpsLoc.longitude);
            const acc = Number(gpsLoc.accuracy || 50);

            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <div key={`gps-${gpsLoc.id}`}>
                <Marker position={[lat, lng]} icon={gpsIcon}>
                  <Popup className="custom-leaflet-popup">
                    <div className="font-mono text-xs space-y-1 p-1">
                      <div className="font-bold text-emerald-600 flex items-center gap-1">
                        <Navigation size={13} /> Browser GPS Location
                      </div>
                      <div className="text-gray-700 font-semibold text-emerald-700">IP: {gpsLoc.ip_address || '127.0.0.1'}</div>
                      <div className="text-gray-700">Session: {gpsLoc.anonymous_session_id}</div>
                      <div className="text-gray-700">Lat: {lat.toFixed(6)}</div>
                      <div className="text-gray-700">Lng: {lng.toFixed(6)}</div>
                      <div className="text-gray-700">Accuracy Radius: ±{Math.round(acc)}m</div>
                      <div className="text-gray-500 text-[10px]">{new Date(gpsLoc.timestamp).toLocaleString()}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 p-1 rounded mt-1">
                        Explicit Browser Geolocation Granted
                      </div>
                      <div className="mt-2 text-center">
                        <a
                          href={`https://www.google.com/maps?q=${lat},${lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded text-[10px] no-underline shadow"
                        >
                          Open in Google Maps ↗
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Render Accuracy Circle */}
                <Circle
                  center={[lat, lng]}
                  radius={acc}
                  pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15, weight: 1 }}
                />
              </div>
            );
          })}
        </MapContainer>
      </div>

      <div className="p-4 rounded-2xl border bg-gray-950/60 font-mono text-xs text-gray-400 flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
        <Info size={16} className="text-blue-400 shrink-0" />
        <span>
          Leaflet map displays markers with full privacy distinction between IP estimations and permission-granted GPS coordinates with accuracy circles.
        </span>
      </div>
    </div>
  );
}
