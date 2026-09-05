import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  MapPin, 
  Flame, 
  Waves, 
  Building, 
  Biohazard, 
  HeartPulse, 
  Navigation, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight 
} from 'lucide-react';
import Button from '../components/common/Button';
import PriorityBadge from '../components/common/PriorityBadge';
import { incidentStore } from '../services/incidentStore';

export default function EmergencyReportPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Flood',
    urgency: 'critical',
    address: '',
    sector: 'Sector 4',
    injured: 0,
    trapped: 0,
    critical: 0,
    description: '',
    reporterName: '',
    reporterPhone: '',
    isAnonymous: false
  });

  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsLocation, setGpsLocation] = useState(null);

  const emergencyCategories = [
    { id: 'Flood', label: 'Flash Flood / Water', icon: Waves, color: 'text-blue-400 border-blue-500/30' },
    { id: 'Fire', label: 'Wildfire / Structure Fire', icon: Flame, color: 'text-orange-400 border-orange-500/30' },
    { id: 'Structural Collapse', label: 'Building Collapse', icon: Building, color: 'text-amber-400 border-amber-500/30' },
    { id: 'Medical', label: 'Mass Medical Trauma', icon: HeartPulse, color: 'text-rose-400 border-rose-500/30' },
    { id: 'Hazardous Materials', label: 'Gas / Chemical Spill', icon: Biohazard, color: 'text-purple-400 border-purple-500/30' }
  ];

  const handleDetectGps = () => {
    setDetectingGps(true);
    setTimeout(() => {
      setDetectingGps(false);
      setGpsLocation({ lat: 37.7749, lng: -122.4194 });
      setFormData((prev) => ({
        ...prev,
        address: 'Sector 4 - Lowland Way near River Corridor (GPS Verified)',
        sector: 'Sector 4'
      }));
    }, 800);
  };

  // Determine computed priority
  const calculateComputedPriority = () => {
    if (formData.urgency === 'critical' || formData.trapped > 0 || formData.critical > 0) {
      return 'CRITICAL';
    }
    if (formData.injured > 0 || formData.category === 'Fire' || formData.category === 'Hazardous Materials') {
      return 'HIGH';
    }
    return 'MEDIUM';
  };

  const computedPriority = calculateComputedPriority();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await incidentStore.addIncident({
        emergencyType: formData.category,
        category: formData.category,
        title: formData.title || `${formData.category} Emergency - ${formData.sector}`,
        description: formData.description || `Reported ${formData.category} near ${formData.address || formData.sector}`,
        priority: computedPriority,
        address: formData.address || 'Address unconfirmed (Coordinates pinned)',
        sector: formData.sector,
        peopleAffected: (Number(formData.injured) || 0) + (Number(formData.trapped) || 0) + 1,
        peopleInjured: Number(formData.injured) || 0,
        peopleTrapped: Number(formData.trapped) || 0,
        injured: formData.injured,
        trapped: formData.trapped,
        critical: formData.critical,
        isMedicalEmergency: formData.critical > 0 || formData.injured > 0 || formData.urgency === 'critical',
        reporterName: formData.isAnonymous ? 'Anonymous Citizen' : formData.reporterName || 'Citizen Dispatcher',
        reporterPhone: formData.isAnonymous ? 'Restricted' : formData.reporterPhone || 'Not provided',
        isAnonymous: Boolean(formData.isAnonymous),
        requiredResources: [
          formData.category === 'Flood' ? 'Rescue Zodiac Boats (2)' : 'First Responder Engine (1)',
          formData.trapped > 0 ? 'Urban Search & Rescue Team (1)' : 'Paramedic Ambulance (1)'
        ],
        aiTriageSummary: `Gemini AI Triage: Automated priority established as ${computedPriority}. Category: ${formData.category}. Citizen notes: ${formData.description || 'Rapid dispatch priority initiated.'}`
      });

      setIsSubmitting(false);
      setSubmittedIncident(created);
    } catch (err) {
      console.error('Error submitting incident:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5 animate-ping" />
          Immediate Citizen Dispatch Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Report an Emergency Incident
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Please provide critical details. Your coordinates and descriptions are triaged in real time by AI and routed directly to the nearest dispatch commander.
        </p>
      </div>

      {/* Confirmation Modal */}
      {submittedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white">Emergency Dispatched!</h3>
              <p className="text-sm text-slate-300">
                Your incident report has been received and prioritized by the CrisisMesh Emergency Operations Center.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>INCIDENT TRACKING CODE</span>
                <span className="text-emerald-400 font-bold text-base">{submittedIncident.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>AI ASSIGNED PRIORITY</span>
                <PriorityBadge priority={submittedIncident.priority} size="xs" />
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>ESTIMATED FIRST RESPONDER ETA</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> 4 - 7 mins
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
              <div className="font-semibold text-amber-300">SAFETY INSTRUCTIONS WHILE WAITING:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Remain in a secure, elevated location away from floodwaters or falling debris.</li>
                <li>Keep your phone line open for responder verification calls.</li>
                <li>If safe, signal with a flashlight, bright cloth, or whistle.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to={`/incidents/${submittedIncident.id}`} className="flex-1">
                <Button variant="primary" className="w-full font-bold">
                  Track Incident Status
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => {
                  setSubmittedIncident(null);
                  setFormData({
                    title: '',
                    category: 'Flood',
                    urgency: 'critical',
                    address: '',
                    sector: 'Sector 4',
                    injured: 0,
                    trapped: 0,
                    critical: 0,
                    description: '',
                    reporterName: '',
                    reporterPhone: '',
                    isAnonymous: false
                  });
                }}
                className="flex-1"
              >
                Report Another
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        {/* Step 1: Emergency Category */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Select Emergency Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {emergencyCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-red-500 shadow-md shadow-red-500/10 ring-1 ring-red-500'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-slate-900 border ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">{cat.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Urgency Level */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Severity Assessment
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'critical', title: 'Life Threatening', desc: 'Immediate risk to life, cardiac, active fire, rising water' },
              { id: 'urgent', title: 'Urgent / Trapped', desc: 'People trapped or injured, escalating danger' },
              { id: 'hazard', title: 'Property / Hazard', desc: 'Road blocked, downed power line, non-immediate danger' }
            ].map((urg) => (
              <label
                key={urg.id}
                className={`p-3.5 rounded-xl border cursor-pointer block transition-all ${
                  formData.urgency === urg.id
                    ? 'bg-red-950/20 border-red-500 text-white ring-1 ring-red-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={urg.id}
                  checked={formData.urgency === urg.id}
                  onChange={() => setFormData({ ...formData, urgency: urg.id })}
                  className="sr-only"
                />
                <div className="text-sm font-bold flex items-center justify-between">
                  <span>{urg.title}</span>
                  {formData.urgency === urg.id && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-snug">{urg.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Location Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              3. Incident Location
            </label>
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={detectingGps}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
              {detectingGps ? 'Pinpointing GPS...' : 'Auto-Detect My GPS'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, landmark, or intersection"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="Sector 1">Sector 1 (North Overpass)</option>
                <option value="Sector 2">Sector 2 (Central Downtown)</option>
                <option value="Sector 3">Sector 3 (West Industrial)</option>
                <option value="Sector 4">Sector 4 (Riverside Basin)</option>
                <option value="Sector 5">Sector 5 (South Foothills)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 4: Casualties & Trapped Counts */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            4. Estimated People Affected
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 block font-medium">Injured Persons</span>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, injured: Math.max(0, formData.injured - 1) })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                >
                  -
                </button>
                <span className="text-lg font-bold text-white font-mono">{formData.injured}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, injured: formData.injured + 1 })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 block font-medium">Trapped / Stranded</span>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, trapped: Math.max(0, formData.trapped - 1) })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                >
                  -
                </button>
                <span className="text-lg font-bold text-amber-400 font-mono">{formData.trapped}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, trapped: formData.trapped + 1 })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 block font-medium">Critical / Unconscious</span>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, critical: Math.max(0, formData.critical - 1) })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                >
                  -
                </button>
                <span className="text-lg font-bold text-red-400 font-mono">{formData.critical}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, critical: formData.critical + 1 })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Description & Situation Details */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            5. Incident Description & Hazards
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what happened: water height, fire spread, specific floor/room number, visible chemicals, sounds..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          ></textarea>
        </div>

        {/* Real-time Gemini Pre-Triage Engine Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/20 via-purple-950/20 to-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Gemini Pre-Triage Assessment Engine
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Real-time Calculation</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-300">
              Calculated Dispatch Priority:
            </div>
            <PriorityBadge priority={computedPriority} size="sm" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Based on chosen category ({formData.category}) and casualty indicators, this incident will automatically be routed to the{' '}
            <strong className="text-white">{computedPriority === 'CRITICAL' ? 'Immediate Priority Queue' : 'Standard Response Fleet'}</strong>.
          </p>
        </div>

        {/* Step 6: Contact Information */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              6. Reporter Contact Information
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-red-500"
              />
              <span>Report Anonymously</span>
            </label>
          </div>

          {!formData.isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                placeholder="Your Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <input
                type="tel"
                value={formData.reporterPhone}
                onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                placeholder="Callback Telephone Number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            icon={AlertCircle}
            className="w-full text-base font-bold py-3.5 shadow-xl shadow-red-500/20"
          >
            {isSubmitting ? 'Transmitting Incident to EOC...' : 'Dispatch Emergency Response'}
          </Button>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            By submitting, you declare this report is made in good faith during an active emergency event.
          </p>
        </div>
      </form>
    </div>
  );
}
