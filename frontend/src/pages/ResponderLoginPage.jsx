import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Radio, 
  Key, 
  CheckCircle2, 
  Building, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import Button from '../components/common/Button';

export default function ResponderLoginPage() {
  const navigate = useNavigate();
  const [badgeId, setBadgeId] = useState('CMD-4091');
  const [password, setPassword] = useState('••••••••••••');
  const [agency, setAgency] = useState('Central EOC Dispatch');
  const [loading, setLoading] = useState(false);

  const demoPersonas = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Incident Commander',
      badge: 'CMD-4091',
      agency: 'Central EOC Dispatch',
      color: 'border-red-500/40 bg-red-950/20 text-red-300'
    },
    {
      name: 'Capt. Marcus Rivera',
      role: 'Lead Paramedic & Triage Officer',
      badge: 'EMS-7812',
      agency: 'Metro Trauma Medical Services',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300'
    },
    {
      name: 'Chief Daniel Vance',
      role: 'USAR Operations Director',
      badge: 'SAR-2204',
      agency: 'Regional Search & Rescue Taskforce',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
    }
  ];

  const handleQuickLogin = (persona) => {
    setBadgeId(persona.badge);
    setAgency(persona.agency);

    setLoading(true);
    setTimeout(() => {
      const user = {
        name: persona.name,
        role: persona.role,
        badge: persona.badge,
        agency: persona.agency,
        token: 'crisismesh_jwt_session_token_' + Date.now()
      };
      localStorage.setItem('crisismesh_user', JSON.stringify(user));
      localStorage.setItem('crisismesh_token', user.token);
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = {
        name: 'Authorized Responder',
        role: 'Field Coordinator',
        badge: badgeId || 'FLD-9901',
        agency: agency,
        token: 'crisismesh_jwt_session_token_' + Date.now()
      };
      localStorage.setItem('crisismesh_user', JSON.stringify(user));
      localStorage.setItem('crisismesh_token', user.token);
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-8 pb-16">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-xl shadow-red-500/20 mx-auto">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Emergency Responder Portal
        </h1>
        <p className="text-sm text-slate-400">
          Authorized personnel access for incident commanders, triage physicians, and field units.
        </p>
      </div>

      {/* 1-Click Persona Quick Selector for Hackathon Review */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Hackathon Demo 1-Click Personas
          </span>
          <span className="text-slate-500 text-[11px]">Instant Authentication</span>
        </div>
        <div className="space-y-2">
          {demoPersonas.map((persona) => (
            <button
              key={persona.badge}
              onClick={() => handleQuickLogin(persona)}
              disabled={loading}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all hover:scale-[1.01] cursor-pointer ${persona.color}`}
            >
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{persona.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 font-mono">
                    {persona.badge}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  {persona.role} • {persona.agency}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Standard Form Login */}
      <form onSubmit={handleManualLogin} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Badge ID / Callsign
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              placeholder="e.g. CMD-4091 or MED-04"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Dispatch Agency / Division
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="e.g. Metro Fire & Rescue Sector 2"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Access Key / Terminal PIN
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Terminal password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full font-bold"
          >
            Authenticate Terminal Session
          </Button>
        </div>
      </form>
    </div>
  );
}
