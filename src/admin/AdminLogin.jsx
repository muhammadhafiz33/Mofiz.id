import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div style={{ backgroundColor: '#0B0F19', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', color: '#ffffff' }}>
      <div style={{ maxWidth: '28rem', width: '100%', position: 'relative', zIndex: 10 }}>
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#9CA3AF', marginBottom: '2rem', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <ArrowLeft size={14} />
          Back to Portfolio
        </button>

        <div style={{ borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: '#111827', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          {/* Header Branding */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', marginBottom: '0.75rem' }}>
              <Lock size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#ffffff', margin: 0 }}>Admin Authentication</h2>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'monospace', marginTop: '0.25rem', margin: 0 }}>Hafiz.id Control Panel Access</p>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: '1.5rem', padding: '0.875rem', borderRadius: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#F87171', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontFamily: 'monospace', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Username / Email</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '0.75rem', padding: '0.625rem 1rem 0.625rem 2.5rem', fontSize: '0.75rem', color: '#ffffff', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontFamily: 'monospace', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '0.75rem', padding: '0.625rem 1rem 0.625rem 2.5rem', fontSize: '0.75rem', color: '#ffffff', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#2563EB', color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', opacity: loading ? 0.6 : 1 }}
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
