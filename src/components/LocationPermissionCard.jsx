import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, CheckCircle2, AlertCircle, X, Loader2, RefreshCw } from 'lucide-react';
import { getOrCreateSessionId } from '../hooks/useVisitorTracker';

// Readings worse than this (in meters) are treated as "approximate" location.
const PRECISE_THRESHOLD_M = 150;
// Stop sampling early once the fix is this good.
const GOOD_ENOUGH_M = 25;
// Max time spent refining the GPS fix.
const SAMPLE_WINDOW_MS = 20000;

const isInAppBrowser = () => {
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|Line\/|WhatsApp|TikTok|musical_ly|Twitter|Snapchat|; wv\)/i.test(ua);
};

const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent || '');

const postLocation = (payload) =>
  fetch('/api/analytics/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anonymous_session_id: getOrCreateSessionId(), ...payload })
  }).catch((err) => console.warn('GPS data recording failed:', err.message));

export default function LocationPermissionCard() {
  // idle | asking | locating | granted | approximate | denied | unsupported
  const [status, setStatus] = useState(() => {
    if (!navigator.geolocation) return 'unsupported';
    return localStorage.getItem('hafiz_geo_consent') === 'denied' ? 'denied' : 'asking';
  });
  const [accuracy, setAccuracy] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);

  const stopWatching = () => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    watchIdRef.current = null;
    timerRef.current = null;
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }
    stopWatching();
    setStatus('locating');
    setErrorMessage('');

    let best = null;
    let lastSentAccuracy = Infinity;

    const finish = () => {
      stopWatching();
      if (!best) return;
      setStatus(best.accuracy <= PRECISE_THRESHOLD_M ? 'granted' : 'approximate');
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        if (best && acc >= best.accuracy) return;

        best = { latitude, longitude, accuracy: acc, timestamp: position.timestamp || Date.now() };
        setAccuracy(acc);
        localStorage.setItem('hafiz_geo_consent', 'granted');

        // Save the first fix right away, then only meaningfully better ones.
        if (acc < lastSentAccuracy * 0.7) {
          lastSentAccuracy = acc;
          postLocation({ ...best, consent_status: 'granted' });
        }

        if (acc <= GOOD_ENOUGH_M) finish();
      },
      (error) => {
        stopWatching();
        if (best) {
          finish();
          return;
        }
        if (error.code === error.PERMISSION_DENIED) {
          setStatus('denied');
          localStorage.setItem('hafiz_geo_consent', 'denied');
          postLocation({ consent_status: 'denied' });
          setErrorMessage('Izin lokasi diblokir di browser.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setStatus('denied');
          setErrorMessage('Lokasi tidak tersedia. Pastikan GPS / Location di perangkat aktif.');
        } else {
          setStatus('denied');
          setErrorMessage('Waktu permintaan lokasi habis. Coba lagi.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    timerRef.current = setTimeout(finish, SAMPLE_WINDOW_MS);
  }, []);

  // If permission was already granted earlier, refresh silently without asking again.
  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) return undefined;

    const check = async () => {
      try {
        if (navigator.permissions?.query) {
          const perm = await navigator.permissions.query({ name: 'geolocation' });
          if (cancelled) return;
          if (perm.state === 'granted') requestLocation();
          else if (perm.state === 'denied') setStatus('denied');
          return;
        }
      } catch {
        /* Permissions API not available (older Safari) */
      }
      if (!cancelled && localStorage.getItem('hafiz_geo_consent') === 'granted') requestLocation();
    };
    check();

    return () => {
      cancelled = true;
      stopWatching();
    };
  }, [requestLocation]);

  // When only approximate location was given, re-check automatically once the visitor
  // comes back from their phone settings (tab becomes visible again).
  useEffect(() => {
    if (status !== 'approximate') return undefined;
    const onVisible = () => {
      if (document.visibilityState === 'visible') requestLocation();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [status, requestLocation]);

  if (dismissed || status === 'idle') return null;

  const inApp = isInAppBrowser();
  const preciseHelp = isIOS()
    ? 'iPhone: Pengaturan → Privasi & Keamanan → Layanan Lokasi → Safari Websites → aktifkan "Lokasi Akurat" (Precise Location), lalu tekan Coba lagi.'
    : 'Android: Pengaturan → Lokasi → aktifkan "Akurasi Lokasi Google" / "Use precise location". Di Chrome: ikon gembok di address bar → Izin → Lokasi → pilih "Akurat". Lalu tekan Coba lagi.';

  return (
    <div
      className="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100%-3rem)] p-4 rounded-2xl border backdrop-blur-xl bg-gray-950/85 text-left shadow-2xl transition-all duration-300"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <MapPin size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono tracking-wide uppercase">Location Analytics</h4>
            <p className="text-[10px] text-gray-400 font-mono">Bagikan lokasi akurat (opsional)</p>
          </div>
        </div>
        <button
          onClick={() => {
            stopWatching();
            setDismissed(true);
          }}
          className="text-gray-500 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Tutup"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-300 leading-relaxed space-y-2">
        {status === 'asking' && (
          <>
            <p className="text-[11px] text-gray-300">
              Boleh bagikan lokasi akurat kamu? Data ini hanya dipakai untuk statistik pengunjung portofolio ini.
            </p>
            {inApp && (
              <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                Kamu membuka dari browser aplikasi (WhatsApp/Instagram/dll). Lokasi biasanya diblokir di sini, buka lewat
                Chrome atau Safari agar berfungsi.
              </p>
            )}
            <button
              onClick={requestLocation}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Bagikan lokasi akurat
            </button>
          </>
        )}

        {status === 'locating' && (
          <div className="flex items-start gap-2 text-blue-300 bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
            <Loader2 size={16} className="shrink-0 mt-0.5 animate-spin" />
            <div>
              <p className="font-semibold">Mencari titik paling akurat…</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                {accuracy ? `Akurasi saat ini ±${Math.round(accuracy)} m` : 'Menunggu sinyal GPS'}
              </p>
            </div>
          </div>
        )}

        {status === 'granted' && (
          <div className="flex items-start gap-2 text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Lokasi akurat diterima. Terima kasih!</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">Akurasi ±{Math.round(accuracy)} m</p>
            </div>
          </div>
        )}

        {status === 'approximate' && (
          <div className="text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lokasi masih perkiraan (±{Math.round(accuracy)} m)</p>
                <p className="text-[11px] text-amber-300/80 mt-0.5">
                  Sepertinya hanya "lokasi perkiraan" yang diizinkan. Mau aktifkan lokasi akurat?
                </p>
              </div>
            </div>
            <p className="text-[11px] text-amber-200/90">{preciseHelp}</p>
            <button
              onClick={requestLocation}
              className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={12} /> Coba lagi
            </button>
          </div>
        )}

        {status === 'denied' && (
          <div className="text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lokasi tidak dibagikan</p>
                <p className="text-[11px] text-amber-300/80 mt-0.5">
                  {errorMessage || 'Tidak apa-apa, portofolio tetap bisa dilihat seperti biasa.'}
                </p>
              </div>
            </div>
            <button
              onClick={requestLocation}
              className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={12} /> Coba lagi
            </button>
          </div>
        )}

        {status === 'unsupported' && (
          <div className="flex items-start gap-2 text-gray-400 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[11px]">Browser ini tidak mendukung lokasi. Situs tetap berjalan normal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
