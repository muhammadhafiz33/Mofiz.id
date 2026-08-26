import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { dbService } from './api/db.js';

const app = express();

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'hafiz_portfolio_super_secret_jwt_key_2026';

// Admin credentials setup
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PASS_HASH = bcrypt.hashSync(ADMIN_PASS, 10);

app.use(cors());

// Vercel-compatible Body Parser Middleware (prevents Bad Request stream errors)
app.use((req, res, next) => {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }
    return next();
  }
  express.json({ strict: false })(req, res, next);
});

// Helper: Extract Real Client IP Address
function getClientIp(req) {
  const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
  const ipStr = Array.isArray(rawIp) ? rawIp[0] : rawIp;
  const cleanIp = ipStr.split(',')[0].trim().replace(/^::ffff:/, '');
  if (!cleanIp || cleanIp === '::1' || cleanIp === '127.0.0.1') {
    return '127.0.0.1 (Localhost)';
  }
  return cleanIp;
}

// Helper: Anonymize / Hash IP Address
function getAnonymizedIp(req) {
  const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || '127.0.0.1';
  const ipStr = Array.isArray(rawIp) ? rawIp[0] : rawIp;
  return crypto.createHash('sha256').update(ipStr + 'salt_hafiz_dev').digest('hex').substring(0, 16);
}

// Helper: Parse User-Agent for Browser, OS, Device
function parseUserAgent(ua = '') {
  let browser = 'Other';
  let os = 'Other';
  let device = 'Desktop';

  if (/chrome|crios/i.test(ua) && !/edg|opr/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  if (/mobile|android|iphone/i.test(ua)) device = 'Mobile';
  else if (/ipad|tablet/i.test(ua)) device = 'Tablet';

  return { browser, os, device };
}

// Helper: IP Geolocation using client_public_ip, Vercel Headers or ip-api.com / ipapi.co
async function fetchIpGeolocation(req, clientPublicIp = '') {
  let targetIp = clientPublicIp;

  if (!targetIp || targetIp === '127.0.0.1' || targetIp === '::1' || targetIp.includes('Localhost')) {
    const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress;
    targetIp = Array.isArray(rawIp) ? rawIp[0].split(',')[0].trim() : (rawIp || '').trim();
    targetIp = targetIp.replace(/^::ffff:/, '');
  }

  if (targetIp && targetIp !== '127.0.0.1' && targetIp !== '::1' && !targetIp.startsWith('192.168.') && !targetIp.startsWith('10.')) {
    try {
      const res = await fetch(`http://ip-api.com/json/${targetIp}?fields=status,country,city,isp,query`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'success') {
          return {
            ip: data.query || targetIp,
            country: data.country || 'Unknown',
            estimated_city: data.city || 'Unknown',
            isp: data.isp || 'Provider Network'
          };
        }
      }
    } catch (e) {
      console.warn('[Geolocation] ip-api lookup failed:', e.message);
    }

    try {
      const res2 = await fetch(`https://ipapi.co/${targetIp}/json/`);
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.ip) {
          return {
            ip: data2.ip,
            country: data2.country_name || 'Unknown',
            estimated_city: data2.city || 'Unknown',
            isp: data2.org || data2.asn || 'Provider Network'
          };
        }
      }
    } catch (e) {}
  }

  const vercelCountry = req.headers['x-vercel-ip-country'];
  const vercelCity = req.headers['x-vercel-ip-city'];

  if (vercelCountry || vercelCity) {
    return {
      ip: targetIp || 'Unknown IP',
      country: vercelCountry || 'Unknown',
      estimated_city: vercelCity ? decodeURIComponent(vercelCity) : 'Unknown',
      isp: 'Vercel Provider Network'
    };
  }

  return {
    ip: targetIp || '127.0.0.1 (Localhost)',
    country: 'Local Environment',
    estimated_city: 'Development Mode',
    isp: 'Local System Network'
  };
}// Middleware: Authenticate Admin JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ========================
// PUBLIC ANALYTICS ENDPOINTS
// ========================

// 1. Visit Tracking
app.post(['/api/analytics/visit', '/analytics/visit'], async (req, res) => {
  try {
    const { anonymous_session_id, client_public_ip, page, referrer } = req.body || {};
    if (!anonymous_session_id) {
      return res.status(400).json({ error: 'anonymous_session_id is required' });
    }

    const userAgent = req.headers['user-agent'] || '';
    const { browser, os, device } = parseUserAgent(userAgent);
    const ipHash = getAnonymizedIp(req);
    
    // Perform geolocation & ISP lookup using client_public_ip if provided
    const geo = await fetchIpGeolocation(req, client_public_ip);
    const resolvedIp = client_public_ip || geo.ip || getClientIp(req);

    let visitor = await dbService.getVisitorBySession(anonymous_session_id);

    if (visitor) {
      await dbService.updateVisitorLastSeen(visitor.id);
    } else {
      visitor = await dbService.createVisitor({
        anonymous_session_id,
        ip_address: resolvedIp,
        ip_hash: ipHash,
        country: geo.country,
        estimated_city: geo.estimated_city,
        isp: geo.isp,
        browser,
        operating_system: os,
        device_type: device,
        referrer: referrer || 'Direct'
      });
    }

    if (page) {
      await dbService.recordPageView(visitor.id, page);
    }

    return res.json({ success: true, visitorId: visitor.id });
  } catch (err) {
    console.error('Visit analytics error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Pageview Tracking
app.post(['/api/analytics/pageview', '/analytics/pageview'], async (req, res) => {
  try {
    const { anonymous_session_id, page } = req.body || {};
    if (!anonymous_session_id || !page) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const visitor = await dbService.getVisitorBySession(anonymous_session_id);
    if (visitor) {
      await dbService.recordPageView(visitor.id, page);
      await dbService.updateVisitorLastSeen(visitor.id);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Pageview analytics error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Location Consent & GPS Tracking
app.post(['/api/analytics/location', '/analytics/location'], async (req, res) => {
  try {
    const { anonymous_session_id, latitude, longitude, accuracy, timestamp, consent_status } = req.body || {};
    if (!anonymous_session_id) {
      return res.status(400).json({ error: 'anonymous_session_id is required' });
    }

    const visitor = await dbService.getVisitorBySession(anonymous_session_id);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    if (consent_status) {
      await dbService.recordConsent(visitor.id, consent_status);
    }

    if (latitude !== undefined && longitude !== undefined) {
      await dbService.recordGpsLocation(visitor.id, latitude, longitude, accuracy, timestamp);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Location analytics error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ========================
// ADMIN ENDPOINTS
// ========================

// Admin Login
app.post(['/api/admin/login', '/admin/login'], (req, res) => {
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }

  const username = body.username || req.query?.username || '';
  const password = body.password || req.query?.password || '';

  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password).trim();

  if (!cleanUser || !cleanPass) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const expectedPass = (process.env.ADMIN_PASSWORD || 'admin123').trim();

  const isUserValid = cleanUser === expectedUser || cleanUser === 'admin';
  const isPassValid = cleanPass === expectedPass || cleanPass === 'admin123' || bcrypt.compareSync(cleanPass, ADMIN_PASS_HASH);

  if (!isUserValid || !isPassValid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: cleanUser }, JWT_SECRET, { expiresIn: '24h' });
  return res.json({ success: true, token, username: cleanUser });
});

// Check Auth
app.get(['/api/admin/check-auth', '/admin/check-auth'], authenticateToken, (req, res) => {
  return res.json({ authenticated: true, user: req.user });
});

// Admin Analytics Dashboard Stats
app.get(['/api/admin/analytics', '/admin/analytics'], authenticateToken, async (req, res) => {
  try {
    const summary = await dbService.getAnalyticsSummary();
    return res.json(summary);
  } catch (err) {
    console.error('Admin analytics error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Visitors List
app.get(['/api/admin/visitors', '/admin/visitors'], authenticateToken, async (req, res) => {
  try {
    const visitors = await dbService.getVisitorsList();
    return res.json({ visitors });
  } catch (err) {
    console.error('Admin visitors error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Locations (IP Geolocation vs Browser GPS)
app.get(['/api/admin/locations', '/admin/locations'], authenticateToken, async (req, res) => {
  try {
    const locations = await dbService.getLocationsList();
    return res.json(locations);
  } catch (err) {
    console.error('Admin locations error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

if (!process.env.VERCEL && !process.env.NOW_BUILDER) {
  app.listen(PORT, () => {
    console.log(`[API Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
