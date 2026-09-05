import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  Ambulance, 
  CheckCircle2, 
  Building2, 
  Plus, 
  Phone, 
  Navigation, 
  Activity, 
  Radio,
  FileText
} from 'lucide-react';
import PriorityBadge, { StatusPill } from '../components/common/PriorityBadge';
import Button from '../components/common/Button';
import { incidentStore } from '../services/incidentStore';

export default function IncidentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(incidentStore.getIncidentById(id));
  const [selectedUnitToAssign, setSelectedUnitToAssign] = useState('');
  const [availableUnits, setAvailableUnits] = useState([
    'Swiftwater Rescue Team 2',
    'Urban Search & Rescue Alpha',
    'Ambulance MED-03',
    'Ambulance MED-05',
    'Regional Hazmat Response 01',
    'Canine Search Unit 3',
    'Wildland Forestry Crew 07'
  ]);

  useEffect(() => {
    const update = () => {
      const found = incidentStore.getIncidentById(id);
      setIncident(found);
    };
    const unsubscribe = incidentStore.subscribe(update);
    return unsubscribe;
  }, [id]);

  if (!incident) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Incident {id} Not Found</h2>
        <p className="text-sm text-slate-400">
          This incident record may have been archived or does not exist.
        </p>
        <Link to="/dashboard">
          <Button variant="secondary" icon={ArrowLeft}>
            Return to Command Grid
          </Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    incidentStore.updateIncidentStatus(incident.id, newStatus);
  };

  const handleAssignUnit = (e) => {
    e.preventDefault();
    if (!selectedUnitToAssign) return;
    incidentStore.assignUnit(incident.id, selectedUnitToAssign);
    setSelectedUnitToAssign('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Incident Grid</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">Change Status:</span>
          <select
            value={incident.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incident Header Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                {incident.id}
              </span>
              <PriorityBadge priority={incident.priority} size="sm" />
              <StatusPill status={incident.status} size="sm" />
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Reported {incident.reportedAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {incident.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                {incident.location.address} • <strong className="text-white">{incident.location.sector}</strong>
              </span>
              <span>•</span>
              <span className="font-mono text-slate-400">
                GPS: {incident.location.lat}, {incident.location.lng}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/map">
              <Button variant="secondary" size="sm" icon={Navigation}>
                View on Tactical Map
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column Incident Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Situational Intel & Casualties */}
        <div className="space-y-6">
          {/* Casualty Breakdown Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-red-400" />
              Casualty & Hazard Assessment
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Injured</div>
                <div className="text-xl font-black text-white font-mono mt-1">
                  {incident.casualties.injured}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-amber-400">Trapped</div>
                <div className="text-xl font-black text-amber-400 font-mono mt-1">
                  {incident.casualties.trapped}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-red-400">Critical</div>
                <div className="text-xl font-black text-red-400 font-mono mt-1">
                  {incident.casualties.critical}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div>Incident Classification: <strong className="text-white">{incident.category}</strong></div>
              <div>Urgency Rating: <strong className="text-red-400">{incident.priority}</strong></div>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Users className="w-4 h-4 text-cyan-400" />
              Reporting Party
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Name:</span>
                <span className="text-white font-medium">{incident.reporter?.name || 'Citizen'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Phone:</span>
                <span className="text-white font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  {incident.reporter?.phone || 'Restricted'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Verification:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> EOC Verified
                </span>
              </div>
            </div>
          </div>

          {/* Required Logistical Resources */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Required Support Equipment
            </h3>
            <ul className="space-y-2 text-xs">
              {incident.requiredResources?.map((res, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 2-Columns: AI Triage & Deployment Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gemini AI Triage Analysis Card */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-slate-900/60 to-slate-950 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 text-sm font-bold">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Google Gemini AI Situational Intelligence</span>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Confidence: 96.4%
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {incident.aiTriageSummary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-mono">RECOMMENDED ACTION:</div>
                <div className="text-white font-medium">Establish forward triage perimeter and route nearest ALS ambulance units.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-mono">TARGET MEDICAL FACILITY:</div>
                <div className="text-white font-medium">Metro Central Trauma Center (Trauma Level 1)</div>
              </div>
            </div>
          </div>

          {/* Assigned Units & Dispatch Control */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Assigned Responders & Fleet</h3>
                <p className="text-xs text-slate-400">Emergency personnel deployed to this incident coordinate</p>
              </div>

              {/* Assign new unit form */}
              <form onSubmit={handleAssignUnit} className="flex items-center gap-2">
                <select
                  value={selectedUnitToAssign}
                  onChange={(e) => setSelectedUnitToAssign(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="">+ Assign Unit...</option>
                  {availableUnits.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <Button type="submit" variant="primary" size="sm" disabled={!selectedUnitToAssign}>
                  Assign
                </Button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {incident.assignedUnits && incident.assignedUnits.length > 0 ? (
                incident.assignedUnits.map((unit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                        <Ambulance className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{unit}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Active Radio Comms Channel 4</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      On Scene
                    </span>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 text-center py-6 text-xs text-slate-500">
                  No units assigned yet. Use the dropdown above to dispatch emergency crews.
                </div>
              )}
            </div>
          </div>

          {/* Incident Chronological Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Situational Incident Timeline</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {incident.timeline?.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-slate-950"></div>
                  <div className="text-xs font-mono text-slate-400">{step.time}</div>
                  <div className="text-sm font-medium text-slate-200 mt-0.5">{step.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
