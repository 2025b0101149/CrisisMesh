import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Layers, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Building2, 
  Ambulance, 
  ShieldAlert, 
  Compass, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  Activity, 
  Sparkles, 
  X, 
  Flame, 
  Waves, 
  Biohazard, 
  ArrowRight 
} from 'lucide-react';
import PriorityBadge, { StatusPill } from '../components/common/PriorityBadge';
import Button from '../components/common/Button';
import { incidentStore } from '../services/incidentStore';

export default function EmergencyMapPage() {
  const [incidents, setIncidents] = useState(incidentStore.getIncidents());
  const [hospitals, setHospitals] = useState(incidentStore.getHospitals());
  const [ambulances, setAmbulances] = useState(incidentStore.getAmbulances());
  const [hazardZones, setHazardZones] = useState(incidentStore.getHazardZones());

  // Layer Visibility Toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showHazards, setShowHazards] = useState(true);

  // Selected Pin / Node for Flyout Inspector
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedSector, setSelectedSector] = useState('ALL');

  useEffect(() => {
    const unsubscribe = incidentStore.subscribe(() => {
      setIncidents(incidentStore.getIncidents());
    });
    return unsubscribe;
  }, []);

  const filteredIncidents = incidents.filter(
    (inc) => selectedSector === 'ALL' || inc.location.sector === selectedSector
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Map Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Tactical Geospatial Mesh Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Emergency Response Map
          </h1>
        </div>

        {/* Sector Quick Filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">Sector:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="ALL">All Sectors (Full Grid)</option>
            <option value="Sector 1">Sector 1 (North Overpass)</option>
            <option value="Sector 2">Sector 2 (Central Downtown)</option>
            <option value="Sector 3">Sector 3 (West Industrial)</option>
            <option value="Sector 4">Sector 4 (Riverside Basin)</option>
            <option value="Sector 5">Sector 5 (South Foothills)</option>
          </select>
        </div>
      </div>

      {/* Main Map Container with Tactical Grid */}
      <div className="relative rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl min-h-[580px] lg:min-h-[640px] flex flex-col">
        {/* Layer Toggles Overlay Toolbar (Top Left) */}
        <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showIncidents
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Incidents ({filteredIncidents.length})</span>
          </button>

          <button
            onClick={() => setShowHazards(!showHazards)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showHazards
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hazard Perimeters</span>
          </button>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showHospitals
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospitals ({hospitals.length})</span>
          </button>

          <button
            onClick={() => setShowAmbulances(!showAmbulances)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showAmbulances
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Ambulance Fleet</span>
          </button>
        </div>

        {/* Legend Overlay (Top Right) */}
        <div className="absolute top-4 right-4 z-30 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-md">
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> High
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Hospital
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ambulance
          </span>
        </div>

        {/* Interactive Tactical Canvas */}
        <div className="relative flex-1 w-full h-full min-h-[580px] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] bg-slate-950 overflow-hidden select-none">
          {/* Sector Boundary Grids & Labels */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 pointer-events-none opacity-25">
            <div className="border-r border-b border-cyan-500/40 p-4 font-mono text-xs text-cyan-400">SECTOR 1 (NORTH OVERPASS)</div>
            <div className="border-r border-b border-cyan-500/40 p-4 font-mono text-xs text-cyan-400">SECTOR 2 (CENTRAL DOWNTOWN)</div>
            <div className="border-b border-cyan-500/40 p-4 font-mono text-xs text-cyan-400">SECTOR 3 (WEST INDUSTRIAL)</div>
            <div className="border-r border-cyan-500/40 p-4 font-mono text-xs text-cyan-400">SECTOR 4 (RIVERSIDE BASIN)</div>
            <div className="border-r border-cyan-500/40 p-4 font-mono text-xs text-cyan-400">SECTOR 5 (SOUTH FOOTHILLS)</div>
            <div className="p-4 font-mono text-xs text-cyan-400">RESERVE STAGING AREA</div>
          </div>

          {/* Radar Center Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[500px] h-[500px] rounded-full border border-cyan-500"></div>
            <div className="w-[300px] h-[300px] rounded-full border border-cyan-500/60 absolute"></div>
            <div className="w-[120px] h-[120px] rounded-full border border-cyan-500/80 absolute"></div>
          </div>

          {/* Layer: Hazard Zones (Polygons / Circles) */}
          {showHazards &&
            hazardZones.map((hazard) => {
              const isFire = hazard.type.includes('Fire');
              const isFlood = hazard.type.includes('Flood');
              const bgColor = isFire
                ? 'bg-orange-600/15 border-orange-500/40'
                : isFlood
                ? 'bg-blue-600/15 border-blue-500/40'
                : 'bg-purple-600/15 border-purple-500/40';

              return (
                <div
                  key={hazard.id}
                  onClick={() => setSelectedNode({ type: 'hazard', data: hazard })}
                  className={`absolute rounded-full border-2 border-dashed ${bgColor} animate-pulse cursor-pointer transition-transform hover:scale-105`}
                  style={{
                    left: `${hazard.coordinates.x}%`,
                    top: `${hazard.coordinates.y}%`,
                    width: `${hazard.coordinates.radius * 6}px`,
                    height: `${hazard.coordinates.radius * 6}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={hazard.name}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="text-[10px] font-mono font-bold uppercase text-white bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                      {hazard.type}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* Layer: Hospitals (Blue Pins) */}
          {showHospitals &&
            hospitals.map((hosp) => (
              <button
                key={hosp.id}
                onClick={() => setSelectedNode({ type: 'hospital', data: hosp })}
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                style={{
                  left: `${hosp.coordinates.x}%`,
                  top: `${hosp.coordinates.y}%`
                }}
              >
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 px-2 py-0.5 rounded border border-slate-700 text-[10px] font-mono text-white whitespace-nowrap">
                  {hosp.name} ({hosp.availableBeds} beds)
                </span>
              </button>
            ))}

          {/* Layer: Ambulances (Emerald Markers) */}
          {showAmbulances &&
            ambulances.slice(0, 8).map((amb, i) => {
              // Simulated positioning per sector
              const sectorPositions = {
                'Sector 1': { x: 72 + i * 2, y: 20 + i * 2 },
                'Sector 2': { x: 45 + i * 2, y: 48 + i * 2 },
                'Sector 3': { x: 26 + i * 2, y: 38 + i * 2 },
                'Sector 4': { x: 34 + i * 2, y: 72 + i * 2 },
                'Sector 5': { x: 78 + i * 2, y: 76 + i * 2 }
              };
              const pos = sectorPositions[amb.sector] || { x: 50, y: 50 };

              return (
                <button
                  key={amb.id}
                  onClick={() => setSelectedNode({ type: 'ambulance', data: amb })}
                  className="absolute z-10 group -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`
                  }}
                >
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400">
                    <Ambulance className="w-3 h-3" />
                  </div>
                </button>
              );
            })}

          {/* Layer: Incidents (Pulsing Red / Amber Pins) */}
          {showIncidents &&
            filteredIncidents.map((inc) => {
              const isCritical = inc.priority === 'CRITICAL';
              return (
                <button
                  key={inc.id}
                  onClick={() => setSelectedNode({ type: 'incident', data: inc })}
                  className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  style={{
                    left: `${inc.location.coordinates.x}%`,
                    top: `${inc.location.coordinates.y}%`
                  }}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isCritical ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-xl p-1.5 text-white shadow-xl ${
                        isCritical ? 'bg-red-600 border border-red-400' : 'bg-amber-600 border border-amber-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  </span>

                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-mono text-white whitespace-nowrap shadow-xl">
                    <span className="font-bold text-red-400">{inc.id}</span>: {inc.category}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Selected Tactical Inspector Flyout (Bottom / Corner Panel) */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-40 rounded-2xl border border-slate-700 bg-slate-900/95 p-5 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Tactical Node Inspector
                </span>
                <h3 className="text-base font-bold text-white leading-snug">
                  {selectedNode.type === 'incident' && selectedNode.data.title}
                  {selectedNode.type === 'hospital' && selectedNode.data.name}
                  {selectedNode.type === 'ambulance' && `Ambulance ${selectedNode.data.id}`}
                  {selectedNode.type === 'hazard' && selectedNode.data.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspector Body Details */}
            <div className="py-3 text-xs space-y-2">
              {selectedNode.type === 'incident' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-mono">PRIORITY:</span>
                    <PriorityBadge priority={selectedNode.data.priority} size="xs" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-mono">STATUS:</span>
                    <StatusPill status={selectedNode.data.status} size="xs" />
                  </div>
                  <div className="text-slate-300 font-mono">
                    Casualties: <strong className="text-amber-400">{selectedNode.data.casualties.injured} Injured</strong>,{' '}
                    <strong className="text-red-400">{selectedNode.data.casualties.trapped} Trapped</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 text-slate-400 font-mono text-[11px] leading-relaxed">
                    {selectedNode.data.aiTriageSummary}
                  </div>
                  <div className="pt-2">
                    <Link to={`/incidents/${selectedNode.data.id}`}>
                      <Button variant="primary" size="sm" className="w-full font-bold">
                        Open Full Incident Dossier
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              {selectedNode.type === 'hospital' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trauma Level:</span>
                    <span className="text-white font-mono">{selectedNode.data.traumaLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Available Beds:</span>
                    <span className="text-emerald-400 font-bold font-mono">{selectedNode.data.availableBeds} of {selectedNode.data.totalBeds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ICU Slots:</span>
                    <span className="text-amber-400 font-bold font-mono">{selectedNode.data.icuAvailable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Helipad:</span>
                    <span className="text-cyan-400 font-mono">{selectedNode.data.helipad ? 'Active & Cleared' : 'None'}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      Route Inbound Patients
                    </Button>
                  </div>
                </>
              )}

              {selectedNode.type === 'ambulance' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class:</span>
                    <span className="text-white font-mono">{selectedNode.data.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-mono">{selectedNode.data.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Crew:</span>
                    <span className="text-slate-200">{selectedNode.data.crew}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel / Battery:</span>
                    <span className="text-white font-mono">{selectedNode.data.fuel} / {selectedNode.data.battery}</span>
                  </div>
                </>
              )}

              {selectedNode.type === 'hazard' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-red-400 font-bold font-mono">{selectedNode.data.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Perimeter:</span>
                    <span className="text-white font-mono">{selectedNode.data.perimeterArea}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 font-mono text-[11px]">
                    {selectedNode.data.activeWarnings}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
