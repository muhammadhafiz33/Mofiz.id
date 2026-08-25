import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Map, LogOut, Shield } from 'lucide-react';

export default function AdminLayout() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('hafiz_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch('/api/admin/check-auth', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthorized(true);
        } else {
          localStorage.removeItem('hafiz_admin_token');
          navigate('/admin/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('hafiz_admin_token');
        navigate('/admin/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('hafiz_admin_token');
    localStorage.removeItem('hafiz_admin_user');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-blue-500 font-mono text-xs gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span>VERIFYING ADMIN AUTHENTICATION...</span>
      </div>
    );
  }

  if (!authorized) return <Navigate to="/admin/login" replace />;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/visitors', label: 'Visitors', icon: Users },
    { path: '/admin/locations', label: 'Location Monitoring', icon: MapPin },
    { path: '/admin/map', label: 'Visitor Map', icon: Map },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b bg-gray-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                Hafiz<span className="text-blue-500">.id</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">Admin Panel</span>
              </h1>
            </div>
          </div>

          {/* Nav items desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                    active
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-mono text-gray-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-all hidden sm:inline-block"
            >
              Public Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono transition-all"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Subnav */}
      <div className="md:hidden border-b bg-gray-900/60 p-2 overflow-x-auto flex items-center gap-2 font-mono text-xs" style={{ borderColor: 'var(--border-color)' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
                active ? 'bg-blue-600 text-white font-medium' : 'text-gray-400'
              }`}
            >
              <Icon size={13} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
