import { useEffect, useRef } from 'react';

export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('hafiz_anon_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('hafiz_anon_session_id', sessionId);
  }
  return sessionId;
}

export function useVisitorTracker() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const sessionId = getOrCreateSessionId();
    const page = window.location.pathname + window.location.hash;
    const referrer = document.referrer || 'Direct';

    // 1. Log initial visit & estimated IP location
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anonymous_session_id: sessionId,
        page,
        referrer
      })
    }).catch(err => {
      console.warn('Analytics visit recording skipped:', err.message);
    });

    // 2. Trigger native browser location prompt automatically (no HTML popup card)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = position.timestamp || Date.now();

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
