import { useState, useEffect, useCallback } from 'react';
import { MapPin, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { getOrCreateSessionId } from '../hooks/useVisitorTracker';

export default function LocationPermissionCard() {
  const [status, setStatus] = useState(() => {
    return localStorage.getItem('hafiz_geo_consent') || 'idle'; // idle | granted | denied | unsupported
  });
  const [dismissed, setDismissed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const requestLocationPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = position.timestamp || Date.now();
        const sessionId = getOrCreateSessionId();

        setStatus('granted');
        localStorage.setItem('hafiz_geo_consent', 'granted');

        // Send to backend
        fetch('/api/analytics/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymous_session_id: sessionId,
            latitude,
            longitude,
            accuracy,
            timestamp,
            consent_status: 'granted'
          })
        }).catch(err => {
          console.warn('GPS data recording failed:', err.message);
        });
      },
      (error) => {
        setStatus('denied');
        localStorage.setItem('hafiz_geo_consent', 'denied');

        const sessionId = getOrCreateSessionId();
        fetch('/api/analytics/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymous_session_id: sessionId,
            consent_status: 'denied'
          })
        }).catch(() => {});

        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location permission blocked by browser.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMessage('Location information unavailable.');
        } else {
          setErrorMessage('Location request timed out.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // Trigger native browser permission prompt automatically on page load
  useEffect(() => {
    // Automatically invoke native browser location popup if consent not saved yet
    const savedConsent = localStorage.getItem('hafiz_geo_consent');
    if (!savedConsent) {
      requestLocationPermission();
    } else if (savedConsent === 'granted') {
      requestLocationPermission(); // refresh coords if previously granted
    }
  }, [requestLocationPermission]);

  if (dismissed || status === 'idle') return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full p-4 rounded-2xl border backdrop-blur-xl bg-gray-950/85 text-left shadow-2xl transition-all duration-300" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <MapPin size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono tracking-wide uppercase">Location Analytics</h4>
            <p className="text-[10px] text-gray-400 font-mono">Privacy-First Geo Insights</p>
          </div>
        </div>

        <button 
          onClick={() => setDismissed(true)} 
          className="text-gray-500 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-300 leading-relaxed">
        {status === 'granted' ? (
          <div className="flex items-start gap-2 text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Location access granted.</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">Your location is being used for location-based analytics.</p>
            </div>
          </div>
        ) : status === 'denied' ? (
          <div className="flex items-start gap-2 text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Location Access Declined</p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">{errorMessage || 'Portfolio functions normally without location access.'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-gray-400 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[11px]">Geolocation is not supported by your browser. Site will run as usual.</p>
          </div>
        )}
      </div>
    </div>
  );
}
