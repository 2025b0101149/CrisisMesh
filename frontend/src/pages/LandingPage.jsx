import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertCircle, 
  Map, 
  LayoutDashboard, 
  Radio, 
  Activity, 
  PhoneCall, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Ambulance, 
  Building2, 
  Users, 
  Cpu
} from 'lucide-react';
import Button from '../components/common/Button';
import PriorityBadge from '../components/common/PriorityBadge';
import { incidentStore } from '../services/incidentStore';

export default function LandingPage() {
  const [kpis, setKpis] = useState(incidentStore.getDashboardKPIs());

  useEffect(() => {
    const unsubscribe = incidentStore.subscribe(() => {
      setKpis(incidentStore.getDashboardKPIs());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Critical Active Advisory Ticker */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-red-300">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-2">
            <div className="font-medium text-red-200 flex items-center gap-2">
              <span className="font-bold tracking-wider uppercase text-red-400 font-mono text-xs px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                ACTIVE EOC ALERT
              </span>
              <span>Regional Flash Floods & Seismic Aftershocks in Sector 4 & 2. High-priority dispatch active.</span>
            </div>
            <Link to="/map" className="inline-flex items-center gap-1 font-semibold text-red-400 hover:text-red-300 shrink-0 text-xs">
              Inspect Hazard Corridors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950 p-8 sm:p-14 lg:p-16 shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-600/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Driven Emergency Response & Logistics Mesh</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            When Seconds Count, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Intelligent Coordination
            </span> Saves Lives.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CrisisMesh coordinates emergency responders, medical fleets, and affected citizens with real-time geospatial triage and automated resource dispatch.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/report" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={AlertCircle}
                className="w-full sm:w-auto text-base font-bold px-8 shadow-xl shadow-red-500/25"
              >
                Report Emergency Incident
              </Button>
            </Link>

            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                icon={LayoutDashboard}
                className="w-full sm:w-auto text-base font-medium px-6"
              >
                Responder Command Grid
              </Button>
            </Link>

            <Link to="/map" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                icon={Map}
                className="w-full sm:w-auto text-base font-medium px-6"
              >
                Tactical Map
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Platform Status Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Active Incidents
          </div>
          <div className="text-3xl font-black text-white font-mono">{kpis.totalActiveIncidents}</div>
          <div className="text-[11px] text-red-400 flex items-center justify-center gap-1 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            {kpis.criticalIncidents} Critical Emergencies
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Rescue Teams Deployed
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {kpis.activeRescueTeams} <span className="text-sm font-normal text-slate-500">/ {kpis.totalRescueTeams}</span>
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center justify-center gap-1 mt-1 font-medium">
            <Activity className="w-3 h-3" />
            Specialized Units Active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Available Ambulances
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {kpis.availableAmbulances} <span className="text-sm font-normal text-slate-500">/ {kpis.totalAmbulances}</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center justify-center gap-1 mt-1 font-medium">
            <Ambulance className="w-3 h-3" />
            Ready for Immediate Dispatch
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Hospital Bed Reserves
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {kpis.availableHospitalBeds}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-1 font-medium">
            <Building2 className="w-3 h-3 text-slate-500" />
            {kpis.availableIcuBeds} ICU Slots Open
          </div>
        </div>
      </div>

      {/* Two-Tier Target Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Citizen Emergency Intake */}
        <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/20 via-slate-900/60 to-slate-900/40 p-8 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">For Affected Citizens</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Stress-tolerant, zero-friction reporting designed for emergency situations. Report fires, trapped persons, or medical trauma in under 30 seconds.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              'One-tap GPS coordinates detection without manual typing',
              'Automated AI triage categorizes severity instantly',
              'Real-time responder ETA and dispatch tracking code',
              'Offline SMS and mesh-network failover readiness'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link to="/report">
              <Button variant="primary" icon={AlertCircle} className="w-full font-semibold">
                Submit Emergency Report
              </Button>
            </Link>
          </div>
        </div>

        {/* First Responders & Command Center */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950 p-8 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">For Incident Commanders & Responders</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Tactical situational awareness across multiple emergency sectors. Coordinate rescue squads, triage hospital loads, and eliminate bottlenecks.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              'Interactive multi-layer map with real-time hazard zones',
              'Automated resource allocation matching nearest ambulances',
              'Hospital trauma & ICU bed availability routing',
              'Audit log and timeline tracking from intake to resolution'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <Link to="/dashboard" className="flex-1">
              <Button variant="secondary" icon={LayoutDashboard} className="w-full font-semibold">
                Command Dashboard
              </Button>
            </Link>
            <Link to="/login" className="flex-1">
              <Button variant="outline" icon={Users} className="w-full font-semibold">
                Responder Access
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Immediate Emergency Hotlines Directory */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Direct Emergency Helpline Directory</h3>
            <p className="text-xs text-slate-400">For life-threatening situations requiring immediate voice telephone response</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Emergency Services', num: '911', desc: 'Police, Fire & Paramedic' },
            { label: 'Disaster Relief Hotline', num: '1-800-621-3362', desc: 'FEMA & State EOC Operations' },
            { label: 'Poison & Hazmat Control', num: '1-800-222-1222', desc: 'Chemical Plumes & Exposure' },
            { label: 'Crisis & Trauma Support', num: '988', desc: 'Mental Health & Disaster Distress' }
          ].map((item) => (
            <div key={item.num} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium">{item.label}</div>
              <div className="text-xl font-bold text-white font-mono mt-1">{item.num}</div>
              <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
