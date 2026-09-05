import React, { useState } from 'react';
import { 
  Building2, 
  Ambulance, 
  Users, 
  Boxes, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Fuel, 
  Battery, 
  Phone, 
  ShieldAlert, 
  Radio,
  Plus
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import Button from '../components/common/Button';
import { incidentStore } from '../services/incidentStore';

export default function ResourceManagementPage() {
  const [activeTab, setActiveTab] = useState('hospitals');
  const [search, setSearch] = useState('');

  const hospitals = incidentStore.getHospitals();
  const ambulances = incidentStore.getAmbulances();
  const rescueTeams = incidentStore.getRescueTeams();
  const supplies = incidentStore.getSupplies();
  const kpis = incidentStore.getDashboardKPIs();

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              CrisisMesh Logistics & Fleet
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Resource Management & Hospital Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time telemetry for hospital emergency beds, ICU load, medical fleets, and disaster stockpiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Logistics Readiness: <strong className="text-emerald-400">{kpis.availableResourcesPercentage}%</strong>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Hospital Emergency Beds"
          value={`${kpis.availableHospitalBeds}`}
          subtext={`of ${kpis.totalHospitalBeds} beds available`}
          icon={Building2}
          variant="success"
        />
        <MetricCard
          title="ICU Slot Capacity"
          value={`${kpis.availableIcuBeds}`}
          subtext={`of ${kpis.totalIcuBeds} critical beds open`}
          icon={ShieldAlert}
          variant="warning"
        />
        <MetricCard
          title="Ambulance Fleet"
          value={`${kpis.availableAmbulances}/${kpis.totalAmbulances}`}
          subtext="ALS & BLS ready to dispatch"
          icon={Ambulance}
          variant="default"
        />
        <MetricCard
          title="Rescue Teams"
          value={`${kpis.activeRescueTeams}/${kpis.totalRescueTeams}`}
          subtext="Specialized units deployed"
          icon={Users}
          variant="info"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'hospitals', label: 'Hospitals & Trauma Centers', icon: Building2, count: hospitals.length },
          { id: 'ambulances', label: 'Ambulance Fleet', icon: Ambulance, count: ambulances.length },
          { id: 'rescue', label: 'Specialized Rescue Teams', icon: Users, count: rescueTeams.length },
          { id: 'supplies', label: 'Equipment & Stockpiles', icon: Boxes, count: supplies.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{tab.label}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950 font-mono text-slate-400">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Hospitals */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map((hosp) => {
              const occupancy = Math.round(((hosp.totalBeds - hosp.availableBeds) / hosp.totalBeds) * 100);
              const isCriticalLoad = hosp.status === 'Critical Load' || occupancy > 85;

              return (
                <div
                  key={hosp.id}
                  className={`rounded-2xl border p-5 space-y-4 backdrop-blur-xl ${
                    isCriticalLoad
                      ? 'bg-red-950/15 border-red-500/30'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 font-bold">{hosp.sector}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                          hosp.status === 'Normal'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20 font-bold'
                        }`}>
                          {hosp.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{hosp.name}</h3>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{hosp.traumaLevel} • {hosp.distance}</div>
                    </div>

                    {hosp.helipad && (
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-700 text-cyan-400 font-bold" title="Helipad Active">
                        HELIPAD
                      </span>
                    )}
                  </div>

                  {/* Bed Capacity Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Total Bed Occupancy</span>
                      <span className="text-white font-bold">{occupancy}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancy > 85 ? 'bg-red-500' : occupancy > 65 ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Available Beds</span>
                      <span className="text-lg font-bold text-emerald-400">{hosp.availableBeds}</span>
                      <span className="text-[10px] text-slate-500 block">of {hosp.totalBeds} total</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">ICU Capacity</span>
                      <span className="text-lg font-bold text-amber-400">{hosp.icuAvailable}</span>
                      <span className="text-[10px] text-slate-500 block">of {hosp.icuTotal} slots</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Facilities</span>
                    <div className="flex flex-wrap gap-1">
                      {hosp.specialties.map((spec, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-cyan-400" /> {hosp.contact}
                    </span>
                    <Button variant="outline" size="sm">
                      Direct Route
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 2: Ambulance Fleet */}
      {activeTab === 'ambulances' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
            <span>ACTIVE EMERGENCY MEDICAL FLEET ({ambulances.length} UNITS)</span>
            <span className="text-emerald-400 font-bold">{kpis.availableAmbulances} READY FOR IMMEDIATE CALL</span>
          </div>

          <div className="divide-y divide-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Unit ID</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Crew Assigned</th>
                  <th className="px-5 py-3">Sector</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Telemetry</th>
                  <th className="px-5 py-3">Target Facility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {ambulances.map((amb) => (
                  <tr key={amb.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-white">{amb.id}</td>
                    <td className="px-5 py-3.5 text-slate-300">{amb.type}</td>
                    <td className="px-5 py-3.5 text-slate-300">{amb.crew}</td>
                    <td className="px-5 py-3.5 font-mono text-cyan-400">{amb.sector}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium ${
                        amb.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : amb.status === 'On Scene'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {amb.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-amber-400" /> {amb.fuel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Battery className="w-3 h-3 text-emerald-400" /> {amb.battery}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">{amb.hospitalTarget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Specialized Rescue Teams */}
      {activeTab === 'rescue' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rescueTeams.map((team) => (
            <div key={team.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {team.id}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{team.name}</h3>
                </div>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  team.status === 'Deployed'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {team.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400">Specialization:</span>
                <div className="text-slate-200 font-medium">{team.specialty}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Personnel</span>
                  <div className="text-white font-bold mt-0.5">{team.personnel} Responders</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Assigned Sector</span>
                  <div className="text-cyan-400 font-bold mt-0.5">{team.sector}</div>
                </div>
              </div>

              {team.assignedIncident ? (
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">Assigned To:</span>
                  <span className="font-mono text-red-400 font-bold">{team.assignedIncident}</span>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-800 text-center text-xs text-emerald-400 font-mono">
                  Standby in Base Depot
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 4: Equipment & Supplies */}
      {activeTab === 'supplies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supplies.map((sup) => {
            const availPct = Math.round((sup.available / sup.total) * 100);
            return (
              <div key={sup.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 backdrop-blur-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{sup.category} Logistics</span>
                    <h3 className="text-base font-bold text-white mt-1">{sup.name}</h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                    {sup.id}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Stock Availability</span>
                    <span className="text-white font-bold">{availPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-500"
                      style={{ width: `${availPct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Available</span>
                    <span className="text-base font-bold text-emerald-400">{sup.available}</span>
                    <span className="text-[10px] text-slate-500 block">{sup.unit}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">In Active Use</span>
                    <span className="text-base font-bold text-amber-400">{sup.inUse}</span>
                    <span className="text-[10px] text-slate-500 block">{sup.unit}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800 font-mono">
                  Depot: <span className="text-slate-300">{sup.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
