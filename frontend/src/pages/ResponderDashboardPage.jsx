import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Flame, 
  Waves, 
  Building, 
  Biohazard, 
  HeartPulse, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Users, 
  ArrowUpRight, 
  Ambulance, 
  Building2, 
  Activity, 
  Boxes, 
  Layers, 
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import PriorityBadge, { StatusPill } from '../components/common/PriorityBadge';
import Button from '../components/common/Button';
import { incidentStore } from '../services/incidentStore';

export default function ResponderDashboardPage() {
  const [incidents, setIncidents] = useState(incidentStore.getIncidents());
  const [kpis, setKpis] = useState(incidentStore.getDashboardKPIs());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    const update = () => {
      setIncidents(incidentStore.getIncidents());
      setKpis(incidentStore.getDashboardKPIs());
    };
    const unsubscribe = incidentStore.subscribe(update);
    return unsubscribe;
  }, []);

  // Filtered incidents
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.sector.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || incident.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || incident.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || incident.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (e, id, newStatus) => {
    e.stopPropagation();
    e.preventDefault();
    incidentStore.updateIncidentStatus(id, newStatus);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-red-400">
              CrisisMesh Incident Command Grid
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Emergency Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multi-agency dispatch, resource allocation, and priority tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/map">
            <Button variant="secondary" icon={MapPin} size="sm">
              Open Tactical Map
            </Button>
          </Link>
          <Link to="/report">
            <Button variant="primary" icon={AlertTriangle} size="sm">
              New Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid - All 7 Required Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Total Active Incidents */}
        <MetricCard
          title="Active Incidents"
          value={kpis.totalActiveIncidents}
          subtext="Under active management"
          icon={ShieldAlert}
          variant={kpis.totalActiveIncidents > 0 ? 'critical' : 'default'}
        />

        {/* 2. Critical Incidents */}
        <MetricCard
          title="Critical"
          value={kpis.criticalIncidents}
          subtext="Immediate threat to life"
          icon={AlertTriangle}
          variant="critical"
        />

        {/* 3. High-Priority Incidents */}
        <MetricCard
          title="High Priority"
          value={kpis.highPriorityIncidents}
          subtext="Escalating hazards"
          icon={Activity}
          variant="warning"
        />

        {/* 4. Available Resources */}
        <MetricCard
          title="Resources"
          value={`${kpis.availableResourcesPercentage}%`}
          subtext="Logistics stock ready"
          icon={Boxes}
          variant="info"
        />

        {/* 5. Active Rescue Teams */}
        <MetricCard
          title="Rescue Teams"
          value={`${kpis.activeRescueTeams}/${kpis.totalRescueTeams}`}
          subtext="Specialized units deployed"
          icon={Users}
          variant="default"
        />

        {/* 6. Available Ambulances */}
        <MetricCard
          title="Ambulances"
          value={`${kpis.availableAmbulances}/${kpis.totalAmbulances}`}
          subtext="ALS & BLS ready"
          icon={Ambulance}
          variant="success"
        />

        {/* 7. Hospital Availability */}
        <MetricCard
          title="Hospital Beds"
          value={`${kpis.availableHospitalBeds}`}
          subtext={`${kpis.availableIcuBeds} ICU beds available`}
          icon={Building2}
          variant="success"
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by incident ID (e.g. INC-8492), location, keyword, or sector..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Quick Filter Selects */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="ALL">All Disaster Types</option>
              <option value="Flood">Flood</option>
              <option value="Hazardous Materials">Chemical / Hazmat</option>
              <option value="Structural Collapse">Structural Collapse</option>
              <option value="Wildfire">Wildfire</option>
              <option value="Mass Transit">Mass Transit</option>
              <option value="Medical Facility">Medical / Care Facility</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <span>
            Showing <strong className="text-white">{filteredIncidents.length}</strong> of{' '}
            <strong className="text-white">{incidents.length}</strong> recorded incidents
          </span>
          {(searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL' || categoryFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('ALL');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="text-xs text-red-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Incident List Feed */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-slate-800 bg-slate-900/30">
            <CheckCircle2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No incidents match your filter criteria.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isCritical = incident.priority === 'CRITICAL';
            return (
              <div
                key={incident.id}
                className={`rounded-2xl border transition-all duration-200 p-5 ${
                  isCritical
                    ? 'bg-red-950/15 border-red-500/30 hover:border-red-500/50'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Metadata & Title */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {incident.id}
                      </span>
                      <PriorityBadge priority={incident.priority} size="xs" />
                      <StatusPill status={incident.status} size="xs" />
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {incident.reportedAt}
                      </span>
                    </div>

                    <Link
                      to={`/incidents/${incident.id}`}
                      className="text-lg font-bold text-white hover:text-red-400 transition-colors flex items-center gap-2 group"
                    >
                      <span>{incident.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 shrink-0" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {incident.location.address} ({incident.location.sector})
                      </span>
                      <span className="font-mono text-slate-300">
                        Casualties: <strong className="text-amber-400">{incident.casualties.injured} injured</strong>,{' '}
                        <strong className="text-red-400">{incident.casualties.trapped} trapped</strong>
                      </span>
                    </div>

                    {/* AI Triage Snippet */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 max-w-3xl">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{incident.aiTriageSummary}</span>
                    </div>
                  </div>

                  {/* Right Actions & Status Control */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">Status:</span>
                      <select
                        value={incident.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(e, incident.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <Link to={`/incidents/${incident.id}`}>
                      <Button variant="outline" size="sm" icon={ChevronRight}>
                        Full Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
