import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';

const DB_FILE = process.env.DB_PATH || path.join(process.cwd(), 'data.db');

let sqliteDb = null;
let tursoClient = null;

// 1. Initialize Turso if credentials exist
if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  try {
    tursoClient = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN
    });
    console.log('[DB] Connected to Turso Cloud SQLite Database.');
  } catch (err) {
    console.error('[DB] Turso connection failed:', err);
  }
}

// 2. Initialize local SQLite ONLY if on local machine (not Vercel) and no Turso
if (!tursoClient && !process.env.VERCEL && !process.env.NOW_BUILDER) {
  try {
    const sqlite3Module = await import('better-sqlite3');
    const Database = sqlite3Module.default;
    sqliteDb = new Database(DB_FILE);
    sqliteDb.pragma('journal_mode = WAL');
  } catch (e) {
    console.log('[DB] SQLite native fallback to FileDB');
  }
}

const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anonymous_session_id TEXT UNIQUE,
    ip_hash TEXT,
    country TEXT,
    estimated_city TEXT,
    isp TEXT,
    browser TEXT,
    operating_system TEXT,
    device_type TEXT,
    referrer TEXT,
    first_seen TEXT,
    last_seen TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id INTEGER,
    page TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS location_consents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id INTEGER,
    consent_status TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS gps_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id INTEGER,
    latitude REAL,
    longitude REAL,
    accuracy REAL,
    timestamp TEXT,
    location_source TEXT DEFAULT 'browser_gps'
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT
  );
`;

if (sqliteDb) {
  try { sqliteDb.exec(INIT_SQL); } catch (err) { console.error('SQLite init error:', err); }
}

if (tursoClient) {
  tursoClient.executeMultiple(INIT_SQL).catch(err => console.error('Turso init error:', err));
}

// FileDB Fallback for memory/ephemeral if neither is present
class FileDB {
  constructor(filePath) {
    this.filePath = filePath.endsWith('.json') ? filePath : filePath + '.json';
    this.data = {
      visitors: [],
      page_views: [],
      location_consents: [],
      gps_locations: [],
      admin_users: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading FileDB:', err);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      // Ignore write errors on read-only serverless filesystems
    }
  }
}

const fileDb = (sqliteDb || tursoClient) ? null : new FileDB(path.join(process.cwd(), 'data_fallback.json'));

export const dbService = {
  async getVisitorBySession(sessionId) {
    if (tursoClient) {
      const res = await tursoClient.execute({
        sql: 'SELECT * FROM visitors WHERE anonymous_session_id = ?',
        args: [sessionId]
      });
      return res.rows.length ? res.rows[0] : null;
    } else if (sqliteDb) {
      const stmt = sqliteDb.prepare('SELECT * FROM visitors WHERE anonymous_session_id = ?');
      return stmt.get(sessionId);
    } else {
      fileDb.load();
      return fileDb.data.visitors.find(v => v.anonymous_session_id === sessionId);
    }
  },

  async createVisitor(v) {
    const now = new Date().toISOString();
    if (tursoClient) {
      const res = await tursoClient.execute({
        sql: `INSERT INTO visitors (anonymous_session_id, ip_hash, country, estimated_city, isp, browser, operating_system, device_type, referrer, first_seen, last_seen, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
        args: [
          v.anonymous_session_id, v.ip_hash || '', v.country || 'Unknown', v.estimated_city || 'Unknown',
          v.isp || 'Unknown', v.browser || 'Unknown', v.operating_system || 'Unknown', v.device_type || 'Desktop',
          v.referrer || 'Direct', now, now, now
        ]
      });
      const id = res.rows.length ? Number(res.rows[0].id) : Date.now();
      return { id, ...v, first_seen: now, last_seen: now };
    } else if (sqliteDb) {
      const stmt = sqliteDb.prepare(`
        INSERT INTO visitors (anonymous_session_id, ip_hash, country, estimated_city, isp, browser, operating_system, device_type, referrer, first_seen, last_seen, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        v.anonymous_session_id, v.ip_hash || '', v.country || 'Unknown', v.estimated_city || 'Unknown',
        v.isp || 'Unknown', v.browser || 'Unknown', v.operating_system || 'Unknown', v.device_type || 'Desktop',
        v.referrer || 'Direct', now, now, now
      );
      return { id: info.lastInsertRowid, ...v, first_seen: now, last_seen: now };
    } else {
      fileDb.load();
      const id = fileDb.data.visitors.length + 1;
      const newVisitor = {
        id,
        anonymous_session_id: v.anonymous_session_id,
        ip_hash: v.ip_hash || '',
        country: v.country || 'Unknown',
        estimated_city: v.estimated_city || 'Unknown',
        isp: v.isp || 'Unknown',
        browser: v.browser || 'Unknown',
        operating_system: v.operating_system || 'Unknown',
        device_type: v.device_type || 'Desktop',
        referrer: v.referrer || 'Direct',
        first_seen: now,
        last_seen: now,
        created_at: now
      };
      fileDb.data.visitors.push(newVisitor);
      fileDb.save();
      return newVisitor;
    }
  },

  async updateVisitorLastSeen(id) {
    const now = new Date().toISOString();
    if (tursoClient) {
      await tursoClient.execute({
        sql: 'UPDATE visitors SET last_seen = ? WHERE id = ?',
        args: [now, id]
      });
    } else if (sqliteDb) {
      const stmt = sqliteDb.prepare('UPDATE visitors SET last_seen = ? WHERE id = ?');
      stmt.run(now, id);
    } else {
      fileDb.load();
      const visitor = fileDb.data.visitors.find(v => v.id === id);
      if (visitor) {
        visitor.last_seen = now;
        fileDb.save();
      }
    }
  },

  async recordPageView(visitorId, page) {
    const now = new Date().toISOString();
    if (tursoClient) {
      await tursoClient.execute({
        sql: 'INSERT INTO page_views (visitor_id, page, timestamp) VALUES (?, ?, ?)',
        args: [visitorId, page, now]
      });
    } else if (sqliteDb) {
      const stmt = sqliteDb.prepare('INSERT INTO page_views (visitor_id, page, timestamp) VALUES (?, ?, ?)');
      stmt.run(visitorId, page, now);
    } else {
      fileDb.load();
      fileDb.data.page_views.push({
        id: fileDb.data.page_views.length + 1,
        visitor_id: visitorId,
        page,
        timestamp: now
      });
      fileDb.save();
    }
  },

  async recordConsent(visitorId, status) {
    const now = new Date().toISOString();
    if (tursoClient) {
      await tursoClient.execute({
        sql: 'INSERT INTO location_consents (visitor_id, consent_status, timestamp) VALUES (?, ?, ?)',
        args: [visitorId, status, now]
      });
    } else if (sqliteDb) {
      const stmt = sqliteDb.prepare('INSERT INTO location_consents (visitor_id, consent_status, timestamp) VALUES (?, ?, ?)');
      stmt.run(visitorId, status, now);
    } else {
      fileDb.load();
      fileDb.data.location_consents.push({
        id: fileDb.data.location_consents.length + 1,
        visitor_id: visitorId,
        consent_status: status,
        timestamp: now
      });
      fileDb.save();
    }
  },

  async recordGpsLocation(visitorId, latitude, longitude, accuracy, timestamp) {
    const ts = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    if (tursoClient) {
      await tursoClient.execute({
        sql: `INSERT INTO gps_locations (visitor_id, latitude, longitude, accuracy, timestamp, location_source)
              VALUES (?, ?, ?, ?, ?, 'browser_gps')`,
        args: [visitorId, latitude, longitude, accuracy, ts]
      });
    } else if (sqliteDb) {
      const stmt = sqliteDb.prepare(`
        INSERT INTO gps_locations (visitor_id, latitude, longitude, accuracy, timestamp, location_source)
        VALUES (?, ?, ?, ?, ?, 'browser_gps')
      `);
      stmt.run(visitorId, latitude, longitude, accuracy, ts);
    } else {
      fileDb.load();
      fileDb.data.gps_locations.push({
        id: fileDb.data.gps_locations.length + 1,
        visitor_id: visitorId,
        latitude,
        longitude,
        accuracy,
        timestamp: ts,
        location_source: 'browser_gps'
      });
      fileDb.save();
    }
  },

  async getAnalyticsSummary() {
    if (tursoClient) {
      const resTotal = await tursoClient.execute('SELECT COUNT(*) as count FROM visitors');
      const totalVisitors = Number(resTotal.rows[0]?.count || 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const resToday = await tursoClient.execute({ sql: 'SELECT COUNT(*) as count FROM visitors WHERE created_at >= ?', args: [today.toISOString()] });
      const visitorsToday = Number(resToday.rows[0]?.count || 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const resWeek = await tursoClient.execute({ sql: 'SELECT COUNT(*) as count FROM visitors WHERE created_at >= ?', args: [weekAgo.toISOString()] });
      const visitorsWeek = Number(resWeek.rows[0]?.count || 0);

      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const resMonth = await tursoClient.execute({ sql: 'SELECT COUNT(*) as count FROM visitors WHERE created_at >= ?', args: [monthAgo.toISOString()] });
      const visitorsMonth = Number(resMonth.rows[0]?.count || 0);

      const resPV = await tursoClient.execute('SELECT COUNT(*) as count FROM page_views');
      const totalPageViews = Number(resPV.rows[0]?.count || 0);

      const resTopPage = await tursoClient.execute('SELECT page, COUNT(*) as count FROM page_views GROUP BY page ORDER BY count DESC LIMIT 1');
      const mostVisitedPage = resTopPage.rows.length ? String(resTopPage.rows[0].page) : '/';

      const resDev = await tursoClient.execute('SELECT device_type, COUNT(*) as count FROM visitors GROUP BY device_type');
      const devices = resDev.rows.map(r => ({ device_type: String(r.device_type), count: Number(r.count) }));

      const resBrowser = await tursoClient.execute('SELECT browser, COUNT(*) as count FROM visitors GROUP BY browser');
      const browsers = resBrowser.rows.map(r => ({ browser: String(r.browser), count: Number(r.count) }));

      const resOS = await tursoClient.execute('SELECT operating_system, COUNT(*) as count FROM visitors GROUP BY operating_system');
      const osList = resOS.rows.map(r => ({ operating_system: String(r.operating_system), count: Number(r.count) }));

      return { totalVisitors, visitorsToday, visitorsWeek, visitorsMonth, totalPageViews, mostVisitedPage, devices, browsers, osList };
    } else if (sqliteDb) {
      const totalVisitors = sqliteDb.prepare('SELECT COUNT(*) as count FROM visitors').get().count;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const visitorsToday = sqliteDb.prepare('SELECT COUNT(*) as count FROM visitors WHERE created_at >= ?').get(today.toISOString()).count;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const visitorsWeek = sqliteDb.prepare('SELECT COUNT(*) as count FROM visitors WHERE created_at >= ?').get(weekAgo.toISOString()).count;

      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const visitorsMonth = sqliteDb.prepare('SELECT COUNT(*) as count FROM visitors WHERE created_at >= ?').get(monthAgo.toISOString()).count;

      const totalPageViews = sqliteDb.prepare('SELECT COUNT(*) as count FROM page_views').get().count;
      const mostVisitedRow = sqliteDb.prepare('SELECT page, COUNT(*) as count FROM page_views GROUP BY page ORDER BY count DESC LIMIT 1').get();
      const mostVisitedPage = mostVisitedRow ? mostVisitedRow.page : '/';

      const devices = sqliteDb.prepare('SELECT device_type, COUNT(*) as count FROM visitors GROUP BY device_type').all();
      const browsers = sqliteDb.prepare('SELECT browser, COUNT(*) as count FROM visitors GROUP BY browser').all();
      const osList = sqliteDb.prepare('SELECT operating_system, COUNT(*) as count FROM visitors GROUP BY operating_system').all();

      return { totalVisitors, visitorsToday, visitorsWeek, visitorsMonth, totalPageViews, mostVisitedPage, devices, browsers, osList };
    } else {
      fileDb.load();
      const visitors = fileDb.data.visitors;
      const pageViews = fileDb.data.page_views;

      const totalVisitors = visitors.length;
      const today = new Date();
      today.setHours(0,0,0,0);
      const visitorsToday = visitors.filter(v => v.created_at >= today.toISOString()).length;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const visitorsWeek = visitors.filter(v => v.created_at >= weekAgo.toISOString()).length;

      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const visitorsMonth = visitors.filter(v => v.created_at >= monthAgo.toISOString()).length;

      const totalPageViews = pageViews.length;
      const pageCounts = {};
      pageViews.forEach(pv => { pageCounts[pv.page] = (pageCounts[pv.page] || 0) + 1; });
      let maxPage = '/';
      let maxCount = 0;
      Object.entries(pageCounts).forEach(([pg, cnt]) => {
        if (cnt > maxCount) { maxCount = cnt; maxPage = pg; }
      });

      const groupCounts = (arr, key) => {
        const map = {};
        arr.forEach(item => {
          const val = item[key] || 'Unknown';
          map[val] = (map[val] || 0) + 1;
        });
        return Object.entries(map).map(([k, count]) => ({ [key]: k, count }));
      };

      return {
        totalVisitors, visitorsToday, visitorsWeek, visitorsMonth, totalPageViews, mostVisitedPage: maxPage,
        devices: groupCounts(visitors, 'device_type').map(i => ({ device_type: i.device_type, count: i.count })),
        browsers: groupCounts(visitors, 'browser').map(i => ({ browser: i.browser, count: i.count })),
        osList: groupCounts(visitors, 'operating_system').map(i => ({ operating_system: i.operating_system, count: i.count }))
      };
    }
  },

  async getVisitorsList() {
    if (tursoClient) {
      const resV = await tursoClient.execute('SELECT * FROM visitors ORDER BY id DESC');
      const visitors = resV.rows;
      const result = [];
      for (const v of visitors) {
        const resGps = await tursoClient.execute({ sql: 'SELECT * FROM gps_locations WHERE visitor_id = ? ORDER BY id DESC LIMIT 1', args: [v.id] });
        const lastGps = resGps.rows.length ? resGps.rows[0] : null;
        const locationSource = lastGps ? 'Browser GPS Location' : (v.country && v.country !== 'Unknown' ? 'Estimated IP Location' : 'Unknown');
        const resPv = await tursoClient.execute({ sql: 'SELECT page FROM page_views WHERE visitor_id = ?', args: [v.id] });
        const pageViews = resPv.rows.map(p => String(p.page));
        result.push({ ...v, location_source: locationSource, gps: lastGps, page_views: pageViews });
      }
      return result;
    } else if (sqliteDb) {
      const visitors = sqliteDb.prepare('SELECT * FROM visitors ORDER BY id DESC').all();
      return visitors.map(v => {
        const lastGps = sqliteDb.prepare('SELECT * FROM gps_locations WHERE visitor_id = ? ORDER BY id DESC LIMIT 1').get(v.id);
        const locationSource = lastGps ? 'Browser GPS Location' : (v.country && v.country !== 'Unknown' ? 'Estimated IP Location' : 'Unknown');
        const pageViews = sqliteDb.prepare('SELECT page FROM page_views WHERE visitor_id = ?').all(v.id).map(p => p.page);
        return { ...v, location_source: locationSource, gps: lastGps || null, page_views: pageViews };
      });
    } else {
      fileDb.load();
      return fileDb.data.visitors.slice().reverse().map(v => {
        const gpsList = fileDb.data.gps_locations.filter(g => g.visitor_id === v.id);
        const lastGps = gpsList.length ? gpsList[gpsList.length - 1] : null;
        const locationSource = lastGps ? 'Browser GPS Location' : (v.country && v.country !== 'Unknown' ? 'Estimated IP Location' : 'Unknown');
        const pageViews = fileDb.data.page_views.filter(p => p.visitor_id === v.id).map(p => p.page);
        return { ...v, location_source: locationSource, gps: lastGps || null, page_views: pageViews };
      });
    }
  },

  async getLocationsList() {
    if (tursoClient) {
      const resIp = await tursoClient.execute('SELECT id, anonymous_session_id, country, estimated_city, isp, created_at as timestamp FROM visitors ORDER BY id DESC');
      const resGps = await tursoClient.execute(`
        SELECT g.id, v.anonymous_session_id, g.latitude, g.longitude, g.accuracy, g.timestamp, g.location_source
        FROM gps_locations g
        JOIN visitors v ON g.visitor_id = v.id
        ORDER BY g.id DESC
      `);
      return { ipLocations: resIp.rows, gpsLocations: resGps.rows };
    } else if (sqliteDb) {
      const ipLocations = sqliteDb.prepare('SELECT id, anonymous_session_id, country, estimated_city, isp, created_at as timestamp FROM visitors ORDER BY id DESC').all();
      const gpsLocations = sqliteDb.prepare(`
        SELECT g.id, v.anonymous_session_id, g.latitude, g.longitude, g.accuracy, g.timestamp, g.location_source
        FROM gps_locations g
        JOIN visitors v ON g.visitor_id = v.id
        ORDER BY g.id DESC
      `).all();
      return { ipLocations, gpsLocations };
    } else {
      fileDb.load();
      const ipLocations = fileDb.data.visitors
        .map(v => ({
          id: v.id, anonymous_session_id: v.anonymous_session_id, country: v.country || 'Unknown',
          estimated_city: v.estimated_city || 'Unknown', isp: v.isp || 'Unknown', timestamp: v.created_at
        })).reverse();

      const gpsLocations = fileDb.data.gps_locations.map(g => {
        const v = fileDb.data.visitors.find(vis => vis.id === g.visitor_id) || {};
        return {
          id: g.id, anonymous_session_id: v.anonymous_session_id || 'Unknown',
          latitude: g.latitude, longitude: g.longitude, accuracy: g.accuracy,
          timestamp: g.timestamp, location_source: g.location_source || 'browser_gps'
        };
      }).reverse();

      return { ipLocations, gpsLocations };
    }
  }
};
