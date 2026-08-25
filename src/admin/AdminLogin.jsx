import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('hafiz_admin_token');
    if (token) {
      fetch('/api/admin/check-auth', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            navigate('/admin/dashboard', { replace: true });
          } else {
            localStorage.removeItem('hafiz_admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('hafiz_admin_token');
        });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.token) {
        localStorage.setItem('hafiz_admin_token', data.token);
        localStorage.setItem('hafiz_admin_user', data.username);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('Network connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Glow overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </button>

        <div className="rounded-3xl border bg-gray-950/80 backdrop-blur-2xl p-8 shadow-2xl" style={{ borderColor: 'var(--border-color)' }}>
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
              <Lock size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono tracking-tight text-white">Admin Authentication</h2>
              <p className="text-xs text-gray-400 font-mono mt-1">Hafiz.id Control Panel Access</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-2">Username / Email</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono tracking-wider uppercase transition-all duration-200 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
