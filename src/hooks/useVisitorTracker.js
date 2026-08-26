import { useEffect, useRef } from 'react';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 Minutes Inactivity Expiry

export function getOrCreateSessionId() {
  const now = Date.now();
  const lastActivity = parseInt(localStorage.getItem('hafiz_session_last_activity') || '0', 10);
  let sessionId = localStorage.getItem('hafiz_anon_session_id');

  // If session expired or doesn't exist, generate a new one
  if (!sessionId || !lastActivity || now - lastActivity > SESSION_TIMEOUT_MS) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + now.toString(36);
    localStorage.setItem('hafiz_anon_session_id', sessionId);
  }

  localStorage.setItem('hafiz_session_last_activity', now.toString());
  return sessionId;
}

export function createNewVisitorSession() {
  const now = Date.now();
  const newSessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + now.toString(36);
  localStorage.setItem('hafiz_anon_session_id', newSessionId);
  localStorage.setItem('hafiz_session_last_activity', now.toString());
  return newSessionId;
}

export function saveLocalVisitorLog(logEntry) {
  try {
    const existing = JSON.parse(localStorage.getItem('hafiz_live_visitor_logs') || '[]');
    const index = existing.findIndex(item => item.anonymous_session_id === logEntry.anonymous_session_id);
    const nowIso = new Date().toISOString();

    if (index >= 0) {
      existing[index] = {
        ...existing[index],
        ...logEntry,
        last_seen: nowIso
      };
    } else {
      existing.unshift({
        id: Date.now(),
        created_at: nowIso,
        first_seen: nowIso,
        last_seen: nowIso,
        ...logEntry
      });
    }
    // Store all visitor logs without artificial cap (limited only by storage/db capacity)
    localStorage.setItem('hafiz_live_visitor_logs', JSON.stringify(existing));
  } catch (e) {
    try {
      const existing = JSON.parse(localStorage.getItem('hafiz_live_visitor_logs') || '[]');
      localStorage.setItem('hafiz_live_visitor_logs', JSON.stringify(existing.slice(0, Math.max(1, existing.length - 10))));
    } catch (err) {}
  }
}

export function useVisitorTracker() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const sessionId = getOrCreateSessionId();
    const page = window.location.pathname + window.location.hash;
    const referrer = document.referrer || 'Direct';

    const userAgent = navigator.userAgent || '';
    let browser = 'Other';
    let os = 'Other';
    let device = 'Desktop';

    if (/chrome|crios/i.test(userAgent) && !/edg|opr/i.test(userAgent)) browser = 'Chrome';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
    else if (/edg/i.test(userAgent)) browser = 'Edge';
    else if (/opera|opr/i.test(userAgent)) browser = 'Opera';

    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
    else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';

    if (/mobile|android|iphone/i.test(userAgent)) device = 'Mobile';
    else if (/ipad|tablet/i.test(userAgent)) device = 'Tablet';

    const sendVisit = async () => {
      let clientPublicIp = '';
      let estimatedCity = 'Unknown';
      let country = 'Unknown';
      let isp = 'Provider Network';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const ipRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (ipRes.ok) {
          const data = await ipRes.json();
          if (data && data.ip) {
            clientPublicIp = data.ip;
            country = data.country_name || country;
            estimatedCity = data.city || estimatedCity;
            isp = data.org || data.asn || isp;
          }
        }
      } catch (e) {
        try {
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 2500);
          const ipRes2 = await fetch('https://api.ipify.org?format=json', { signal: controller2.signal });
          clearTimeout(timeoutId2);

          if (ipRes2.ok) {
            const ipData = await ipRes2.json();
            clientPublicIp = ipData.ip || '';
          }
        } catch (err) {}
      }

      // Save dynamic visit log to local storage
      saveLocalVisitorLog({
        anonymous_session_id: sessionId,
        ip_address: clientPublicIp || 'Detecting...',
        country,
        estimated_city: estimatedCity,
        isp,
        browser,
        operating_system: os,
        device_type: device,
        referrer,
        page,
        location_source: 'Estimated IP Location'
      });

      // Send to server backend
      fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymous_session_id: sessionId,
          client_public_ip: clientPublicIp,
          page,
          referrer
        })
      }).catch(() => {});
    };

    sendVisit();

    // Trigger browser geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = position.timestamp || Date.now();

          saveLocalVisitorLog({
            anonymous_session_id: sessionId,
            location_source: 'Browser GPS Location',
            gps: { latitude, longitude, accuracy, timestamp }
          });

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
          }).catch(() => {});
        },
        () => {
          fetch('/api/analytics/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              anonymous_session_id: sessionId,
              consent_status: 'denied'
            })
          }).catch(() => {});
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, []);
}

