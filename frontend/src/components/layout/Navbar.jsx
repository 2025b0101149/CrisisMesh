import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Map, 
  LayoutDashboard, 
  Boxes, 
  AlertCircle, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  UserCheck 
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { fetchHealthStatus } from '../../services/healthService';

export default function Navbar() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [responderUser, setResponderUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if responder is logged in
    const checkAuth = () => {
      const userStr = localStorage.getItem('crisismesh_user');
      if (userStr) {
        try {
          setResponderUser(JSON.parse(userStr));
        } catch (e) {
          setResponderUser(null);
        }
      } else {
        setResponderUser(null);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      const res = await fetchHealthStatus();
      if (isMounted) {
        setBackendStatus(res.success ? 'connected' : 'disconnected');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('crisismesh_user');
    localStorage.removeItem('crisismesh_token');
    setResponderUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tactical Map', path: '/map', icon: Map },
    { name: 'Resources & Fleet', path: '/resources', icon: Boxes },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-500 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Crisis<span className="text-red-500">Mesh</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  EOC v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide -mt-0.5">
                AI Emergency Grid
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Report Emergency CTA */}
            <Link
              to="/report"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 border border-red-500/30 active:scale-95 transition-all"
            >
              <AlertCircle className="w-4 h-4 animate-pulse" />
              <span>Report Incident</span>
            </Link>

            {/* Responder Login / Profile */}
            {responderUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    {responderUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {responderUser.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out of responder terminal"
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Responder Portal</span>
              </Link>
            )}

            {/* Live API Health Status */}
            <div className="hidden xl:flex items-center pl-2 border-l border-slate-800">
              <StatusBadge
                status={backendStatus}
                label={backendStatus === 'connected' ? 'API Online' : 'API Offline'}
                size="sm"
              />
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden gap-2">
            <Link
              to="/report"
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white"
            >
              Report
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 text-slate-400" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold bg-red-600 text-white"
            >
              <AlertCircle className="w-5 h-5" />
              Report Emergency Incident
            </Link>

            {responderUser ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-sm font-semibold text-white">{responderUser.name}</div>
                  <div className="text-xs text-slate-400">{responderUser.role}</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium border border-slate-800 bg-slate-900 text-slate-300"
              >
                <LogIn className="w-4 h-4" />
                Responder Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
