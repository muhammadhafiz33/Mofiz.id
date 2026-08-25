import { useEffect, useRef } from 'react';

export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('hafiz_anon_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('hafiz_anon_session_id', sessionId);
  }
  return sessionId;
}

export function saveLocalVisitorLog(logEntry) {
  try {
    const existing = JSON.parse(localStorage.getItem('hafiz_live_visitor_logs') || '[]');
    const index = existing.findIndex(item => item.anonymous_session_id === logEntry.anonymous_session_id);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...logEntry, last_seen: new Date().toISOString() };
    } else {
      existing.unshift({
        id: Date.now(),
        created_at: new Date().toISOString(),
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        ...logEntry
      });
    }
    // Limit to 50 entries max
    localStorage.setItem('hafiz_live_visitor_logs', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {}
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

    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
    else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';

    if (/mobile|android|iphone/i.test(userAgent)) device = 'Mobile';
    else if (/ipad|tablet/i.test(userAgent)) device = 'Tablet';

    const sendVisit = async () => {
      let clientPublicIp = '180.252.164.21';
      let estimatedCity = 'Padang';
      let country = 'Indonesia';
      let isp = 'PT Telekomunikasi Indonesia';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const ipRes = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          clientPublicIp = ipData.ip;
        }
      } catch (e) {}

      // Save to localStorage for instant local admin dashboard visibility
      saveLocalVisitorLog({
        anonymous_session_id: sessionId,
        ip_address: clientPublicIp,
        country,
        estimated_city: estimatedCity,
        isp,
        browser,
        operating_system: os,
        device_type: device,
        referrer,
        page
      });

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

    // Trigger browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = position.timestamp || Date.now();

          // Save GPS location to localStorage
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
          saveLocalVisitorLog({
            anonymous_session_id: sessionId,
            location_source: 'Estimated IP Location'
          });

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
